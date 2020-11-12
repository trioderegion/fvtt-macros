// Macro Author: Freeze#2689 (on discord)
// Macro version: 0.1
// Prerequisites: Furnace, midiQOL and Item Macro
// For Beacon of Hope functionality an active effect is needed that puts a flag on the actor ("world", "BeaconOfHope", true) for the duration of the Beacon of Hope Spell.
//
// Usage: Take the healing spells Cure Wounds, Healing Word, and their mass varieties from the 5e SRD compendium and place them in the item library
// On those items remove the healing formula on the details tab, leave the rest as is. Then click Item Macro on the title bar of the item, and paste this macro in the macro box.
// Be sure to have the boxes ticked in the Item Macro settings to ensure the macro runs when the spell is activated from either the quick bar or inventory.


const cleric = token.actor.items.getName("Cleric");
let hasDiscipleOfLife = (cleric.data.data.levels >= 1 && cleric.data.data.subclass == "Life Domain")  ? true : false;  // at level 1 each Life Domain cleric gets a boost to their healing spells.
let hasBlessedHealer  = (cleric.data.data.levels >= 6 && cleric.data.data.subclass == "Life Domain")  ? true : false;  // at level 6 they start healing themselves a bit too.
let hasSupremeHealing = (cleric.data.data.levels >= 17 && cleric.data.data.subclass == "Life Domain") ? true : false;  // at level 17 each Life Domain cleric gets to cast their healing spells with maxed out dice.

(()=>{
    let targets = Array.from(game.user.targets);
    if ((item.name == "Cure Wounds" || item.name == "Healing Word") && targets.length > 1) return ui.notifications.error(`Please target exactly 1 token when casting ${item.name}.`); 
    item.actor.useSpell(item).then(async (result)=>{
        if(!result) return;
        let content = result.data.content;                                                 // this is the actual content of the item card when used.
        let diceNumber = parseInt(content.charAt(content.indexOf("data-spell-level")+18)); // Kekilla's method of getting the upcast of the spell, why mess with something that works.
        const bonusHealLevel = (hasDiscipleOfLife == true) ? diceNumber + 2 : 0;           // here the right amount of Disciple of Life bonus healing is determined.
        diceNumber = (item.name == "Mass Healing Word" || item.name == "Mass Cure Wounds") ? diceNumber - 2 : diceNumber;  // correcting for higher level spells. That have start their level different. MassHealWord = 1d4 or (3-2)d4 and MassCureWounds = 3d8 or (5-2)d8
        for (let target of targets) {
            const formula = item.data.data.scaling.formula;                                // the scaling formula for all healing spells are 1d4 or 1d8.
            const mod = token.actor.data.data.abilities.wis.mod;                           // gets the caster wisdom modifier for bonus to the spell... might need to adjust this to accomodate those warlock healers... ugh.
            let hasBoH = await target.actor.getFlag("world", "BeaconOfHope");              // check to see if the target is under Beacon of Hope influnce, if that flag returns true, max out dice instead of rolling.
            let healAmount = 0;
            let healRoll = {};
            if (hasBoH == true || hasSupremeHealing == true) {
                let healDice = parseInt(formula.charAt(formula.indexOf("d")+1)) * diceNumber; // gets you a number that equals the max dice.
                healRoll = new Roll(`${healDice} + ${mod} + ${bonusHealLevel}`);           // bit of a fake roll as there no actual dice, but mQOL needs a roll...
                healRoll.roll();
                healAmount = -1 * healRoll.total;
            }
            else {
                healRoll = new Roll(formula + ` + ${mod} + ${bonusHealLevel}`);
                healRoll.alter(diceNumber, 0);                                             // here the right amount of dice are determined.
                healRoll.roll();
                healAmount = -1 * healRoll.total;
            }
            // applying the healing, finally!
            new MidiQOL.DamageOnlyWorkflow(actor, token, healAmount, "Healing", [target], healRoll, {flavor: `<h2><img src="${item.data.img}" title="Healing" width="36" height="36" /> ${item.data.name} </h2><p>Target: ${target.name}</p>`});
        }
        if (hasBlessedHealer == true) {                                                    // check for blessed healer to be able to self heal the cleric a bit when casting the healing spell.
            let selfHeal = bonusHealLevel;
            let hp = Math.clamped(token.actor.data.data.attributes.hp.value + selfHeal, 0, token.actor.data.data.attributes.hp.max);
            await token.actor.update({"data.attributes.hp.value": hp});
        }
    });
})();