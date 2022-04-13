//Requires: Warp Gate, Sequencer, and Item Macro (for built in mob attack feature).
//Usage: Select homogenous token group and run script to group and add mob attack item.
//       Select group token and run again to split back into *approximately* the corresponding
//       number of individual creatures as the group's current HP would split into.

const group = canvas.tokens.controlled.length > 1 ? canvas.tokens.controlled : [token.document.getFlag('world','group')]

const make = group.length > 1

const groupAttackData = {
    "name": "Group Attack",
    "type": "weapon",
    "data": {
        "weaponType": "improv",
        "activation.type": "special",
    },
    "flags": {
        "itemacro": {
            "macro": {
                "data": {
                    "_id": null,
                    "name": "Group Attack",
                    "type": "script",
                    "author": "ZWI1NTliNWFjZTc5",
                    "img": "icons/svg/dice-target.svg",
                    "scope": "global",
                    "command": "const group = token.getFlag('world','group')\n\nif(!group){\n    ui.notifications.error('Not a group!')\n    return\n}\n\nconst hp = token.actor.data.data.attributes.hp;\nconst size = Math.ceil(hp.value/(hp.max/group.size))\n\nconst target = game.user.targets?.values().next().value?.document\n\nif (!target) {\n    ui.notifications.warn('must target');\n    return;\n}\n\nconst targetAC = target.actor.data.data.attributes.ac.value;\n\nconst attacks = token.actor.items.filter( item => item.hasAttack );\nlet buttonData = attacks.map( item => {\n    const toHit = item.getAttackToHit();\n    return {\n        //label: item.name,\n        value: {\n            item,\n            numHits: 0\n        },     \n        toHitEval: new Roll(toHit.parts.join('+'), item.getRollData()).evaluate({async:true})\n    }\n})\n\nfor( let data of buttonData ){\n    data.toHitEval = await data.toHitEval;\n}\n\nconst LUT = [1,1,1,1,1,2,2,2,2,2,2,2,3,3,4,4,5,5,10,20];\n\nbuttonData.forEach( button => {\n    const d20Needed = Math.max(targetAC - button.toHitEval.total, 1);\n    const numNeeded = LUT[d20Needed-1];\n    button.value.numHits = Math.floor(size/numNeeded);\n    button.label = `${button.value.item.name}: ${button.value.numHits} hit (+${button.toHitEval.total} to hit, ${numNeeded} required).`\n})\n\nconst chosen = await warpgate.buttonDialog({buttons: buttonData, title: `Group of ${size} attacks!`}, 'column')\nif(!chosen) return;\n\nawait ChatMessage.create({content: `${chosen.numHits} attackers hit ${target.name} with ${targetAC} AC.`})\n\n//For fun, roll a d20, on 20, roll crit damage ;)\nfor( let i = 0; i < chosen.numHits; i++){\n    const critical = Math.floor(Math.random() * 20) == 19;\n    await chosen.item.rollDamage({critical});\n}",
                    "folder": null,
                    "sort": 0,
                    "permission": {
                        "default": 0
                    },
                    "flags": {}
                }
            }
        }
    }
}

const splitGroup = async () => {
    const hp = token.actor.data.data.attributes.hp;
    const avgHp = Math.ceil(hp.max/group[0].size)
    const numFull =  Math.floor(hp.value/avgHp)
    const spillOver = hp.value - numFull * avgHp;

    const center = token.center;

    const fullUpdates = { 
        //token: group.token,
        actor: {
            ...token.actor.toObject(),
            'data.attributes.hp.value': avgHp,
            'data.attributes.hp.max': avgHp,
        },
        embedded: {
            Item: {"Group Attack": warpgate.CONST.DELETE}
        }
    }

    const spillOverUpdates = { 
        //token: group.token,
        actor: {
            ...token.actor.toObject(),
            'data.attributes.hp.value': spillOver,
            'data.attributes.hp.max': avgHp,
        },
        embedded: {
            Item: {"Group Attack": warpgate.CONST.DELETE}
        }
    }

    await warpgate.dismiss(token.document.id);

    const tokenData = await game.actors.get(token.document.data.actorId).getTokenData(group.token)

    await warpgate.spawnAt(center, tokenData, fullUpdates, {}, {duplicates:numFull})

    if (spillOver > 0) {
        await warpgate.spawnAt(center, tokenData, spillOverUpdates, {}, {collision:true})
    }
}

const makeGroup = async () => {
    
    const heterogeneous = group.find( token => token.data.actorId !== group[0].data.actorId)

    if (heterogeneous) {
        ui.notifications.warn("Dissimilar group!"); 
        return;
    }
    const numGroup = group.length;
    const numTokenSpaces = numGroup

    //col then row
    const numCol = Math.ceil(Math.sqrt(numTokenSpaces))
    const numRow = Math.ceil(numTokenSpaces/numCol)

    token.document.update({width:numCol, height:numRow, scale: token.data.scale/numCol, 'flags.world.group': {size: numGroup, token: token.document.toObject()}, name: `${token.name} Group (${numGroup})`})

    const totalHP = group.reduce( (acc, token) => {
        acc += token.actor.data.data.attributes.hp.value
        return acc;
    },0)
    await token.actor.update({'data.attributes.hp': {value: totalHP, max: totalHP}})
    await token.actor.createEmbeddedDocuments('Item', [groupAttackData])

    const toDelete = canvas.tokens.controlled.filter( t => t.id !== token.id);

    const offset = token.w/4;
    const schedule = [[-offset, offset],[-offset, offset],[offset, -offset] ]

    const groupAnims = [];

    for(let i=0; i<numGroup-1; i++){
        const anim = new Sequence()
                        .effect()
                            .atLocation(token)
                            .from(group[i+1])
                            .fadeIn(1000)
                            .attachTo(token)
                            .name(`${token.id}-${i}`)
                            .belowTokens()
                            .persist()
                            .randomizeMirrorX()
                            .randomizeMirrorY()
                            .randomRotation()
                            
                            
                            .loopProperty("sprite", "position.x", { from: schedule[i%schedule.length][0], to: schedule[i%schedule.length][1], duration: 4000 + (1000*i), pingPong: true, ease: 'easeInOutCubic'})
                            .loopProperty("sprite", "position.y", { from: schedule[(i+1)%schedule.length][0], to: schedule[(i+1)%schedule.length][1], duration: 9000 + (1000*i), pingPong: true, ease: 'easeOutBounce' })
        groupAnims.push(anim);
    }

    groupAnims.forEach( a => a.play() );

    await canvas.scene.deleteEmbeddedDocuments('Token', toDelete.map( t => t.id ));
}

if (make) return makeGroup();

return splitGroup();
