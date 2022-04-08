//TODO Comment
//MIT (c) 2022 Matthew Haentshcke

const casterToken = token;
const numberOfImages = 3;
const castEffect = `jb2a.impact.004.blue`;
const orbitDuration = 100 //this.effectOptions.orbitDuration;
const imageOpacity = 0.7 //this.effectOptions.imageOpacity;
let casterTokenImg = casterToken.data.img;
const minImageRoll = [0,10,7,5]


const images = token.document.getFlag('world', 'mirrorImages') ?? 0;

const endEffects = async () => {
    await Sequencer.EffectManager.endEffects({name: `mi-${casterToken.id}-1`})
    await Sequencer.EffectManager.endEffects({name: `mi-${casterToken.id}-2`})
    await Sequencer.EffectManager.endEffects({name: `mi-${casterToken.id}-0`})
    await token.document.unsetFlag('world', 'mirrorImages');
};

if (images === 0) {

    
    if (typeof item != 'undefined') await item.roll();
    await token.document.setFlag('world','mirrorImages', 3);

    //Taken in large part from Advanced Spell Effects
    //MIT (c) 2020 Vauryx
    //https://github.com/Vauryx/AdvancedSpellEffects/blob/master/LICENSE
    const positions = [];
    const angles = [...Array(120).keys()].map(x => x * 3);
    for (let i = 0; i < numberOfImages; i++) {
        var centerOffset = 10 + Math.random() * 75//this.effectOptions.orbitRadius;
        var rotationOffset = angles.length / numberOfImages * i;
        const trig = (formula) => {
            const pos = angles.map(angle => centerOffset * Math[formula](angle * (Math.PI / 180)));
            return [...pos.slice(rotationOffset), ...pos.slice(0, rotationOffset)];
        }
        positions.push({
            x: trig('cos'),
            y: trig('sin'),
        });
    }

    const seq = new Sequence()
        .effect()
        .file(castEffect)
        .atLocation(casterToken)
        .fadeIn(500)
        .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.illusion")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .filter("Glow")
        .scale(0.5)
        .scaleIn(0, 500, {
            ease: "easeOutCubic"
        })
        .waitUntilFinished(-1000);

    positions.forEach((position, index) => {
        seq.effect()
            .from(casterToken)
            .fadeIn(1000)
            .attachTo(casterToken)
            .loopProperty("sprite", "position.x", {
                values: index % 2 ? position.x : position.x.slice().reverse(),
                duration: orbitDuration,
                pingPong: false,
            })
            .loopProperty("sprite", "position.y", {
                values: index % 3 ? position.y : position.y.slice().reverse(),
                duration: orbitDuration,
                pingPong: false,
            })
            .persist()
            .scaleOut(0, 300, { ease: "easeInExpo" })
            .opacity(imageOpacity)
            .name(`mi-${casterToken.id}-${index}`);
    });

    seq.play()
    //END ASE USAGE
    
} else {
    //we have images and need to check for hits.
    const buttons = [
        {
            label: `Hit`,
            value: true,
        },{
            label: "Miss",
            value: false
        },{
            label: "End Spell",
            value: 'end'
        }
    ]

    const result = await warpgate.buttonDialog({buttons, title: 'Mirror Image Management', content: `Confirming attack hits AC ${token.actor.data.data.attributes.ac.value}`})

    if (result === false) return;

    if(result === 'end') {
        await endEffects();
        return;
    }

    /* roll a d20 to see if it hits a mirror */
    const hitRoll = await new Roll(`1d20cs>${minImageRoll[images]}`).evaluate({async:true})
    await hitRoll.toMessage({flavor: `With ${images} images remaining a roll greater than ${minImageRoll[images]} results in a image being struck instead.`, speaker: {alias: 'Mirror Images'}})
    
    if (hitRoll.total < 1) {
        /* chatmessage = hits actor name  */
        await ChatMessage.create({speaker: ChatMessage.getSpeaker({token}), content: "I am struck!"});
        return;
    }

    /* it hit a mirror, update the flag, send a message, and end the effect */
    await ChatMessage.create({speaker: {alias: 'Mirror Images'}, content: "<i>an image fades away</i>"});

    await Sequencer.EffectManager.endEffects({name: `mi-${casterToken.id}-${images-1}`});
    const newImages = images - 1;
    if(newImages > 0) {
        await token.document.setFlag('world','mirrorImages', newImages);
    } else {
        await token.document.unsetFlag('world','mirrorImages');
    }
}
