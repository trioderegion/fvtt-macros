/** Dragon's Breath
 * Author: honeybadger#2614
 * License: MIT (c) 2022
 * Prerequisites: Warp Gate, Item Macro (as written)
 * 
 * Usage: Execute macro using preferred method, ensuring
 * that the first two lines (spellLevel and actorDc) are
 * correctly populated using your roller of choice (core and
 * MRE supported, as written). Target a token and select
 * the desired element type. A new at-will spell will
 * be added to the target via Warp Gate's Mutation system.
 * This requires an active GM if your target is not
 * an owned token.
 */

const spellLevel = await warpgate.dnd5e.rollItem(item);
const actorDc = actor.data.data.attributes.spelldc;

const buttonData = [
    {
        label: '🫧 Acid',
        value: 'acid',
    },{
        label: '❄️ Cold',
        value: 'cold'
    },{
        label: '🔥 Fire',
        value: 'fire'
    },{
        label: '⚡ Lightning',
        value: 'lightning'
    },{
        label: '☠️ Poison',
        value: 'poison'
    }
];

const element = await warpgate.buttonDialog({buttons: buttonData, title: 'Target recipient and select element:'}, 'column')

if(!element) return;

const target = game.user.targets.first();

if(!target) {
    ui.notifications.warn('Please target one token to receive the ability.')
}

const abilityData = {
    "name": "Breath Weapon",
    "type": "spell",
    "img": "icons/creatures/abilities/dragon-fire-breath-orange.webp",
    "data": {
        "activation": {
            "type": "action",
            "cost": 1
        },
        "duration": {
            "units": "inst"
        },
        "target": {
            "value": 15,
            "units": "ft",
            "type": "cone"
        },
        "range": {
            "units": "self"
        },
        "ability": "",
        "actionType": "save",
        "damage": {
            "parts": [
                [
                    "(@item.level + 1)d6",
                    element
                ]
            ]
        },
        "save": {
            "ability": "dex",
            "dc": actorDc,
            "scaling": "flat"
        },
        "level": spellLevel,
        "school": "trs",
        "preparation": {
            "mode": "atwill"
        },
    },
}


const updates = {
    embedded: {
        Item: {
            [abilityData.name]: abilityData
        }
    }
}

await warpgate.mutate(target.document, updates, {}, {name: 'Dragon\'s Breath Ability', description: `Providing an at-will spell, ${abilityData.name}, at level ${spellLevel} using ${element} damage`});
