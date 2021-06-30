/* CONFIG */
const module = MODULE.ITEM_MACRO
const summonItem = item; //'item' defined by Item Macro
const actorNameToSpawn = "Aberrant Spirit";
const summonerActor = summonItem.actor;
const summonerDc = summonerActor.data.data.attributes.spelldc;
const summonerSpellAttackMod = summonerDc - 8;

/** needs to return a plain update object for this specific summoned token 
    Note: this can be an empty object to skip updating the token */
function tokenUpdateGenerator(castingLevel, summonerActor, summonedToken){
    return {
        "name": `${summonerActor.name}'s Spirit`,
        "displayName": CONST.TOKEN_DISPLAY_MODES.HOVER
    }
}

/** needs to return a plain update object for this specific summoned actor 
    Note: this can be an empty object to skip updating the actor */
function actorUpdateGenerator(castingLevel, summonerActor, summonedToken){
    return {
        "name" : `${summonerActor.name}'s ${actorNameToSpawn}`,
        "data.attributes.ac.value": 11 + castingLevel,
        "data.attributes.hp": {value: 40 + 10*(castingLevel - 4), max: 40 + 10*(castingLevel - 4)},
    };
}

/** needs to return an array of item updates (including '_id' field) 
    Note: this can be an empty array to skipp updating the actor's items */
function itemUpdateGenerator(castingLevel, summonerActor, summonedToken){
    let itemUpdates = [];
    
    /** scale whispering aura */
    const whisperingAura = summonedToken.actor.items.getName("Whispering Aura");
    itemUpdates.push({"_id": whisperingAura.id, "data.save": {ability:"wis", dc:summonerDc, scaling:"flat"}  , "data.damage.parts": [[`2d6`,"psychic"]],});
    
    /** scale eye ray (negate own spell attack bonuses) */
    const eyeRay = summonedToken.actor.items.getName("Eye Ray");
    itemUpdates.push({
        "_id": eyeRay.id,
        "data.attackBonus": `- @mod - @prof + ${summonerSpellAttackMod}`,
        "data.damage.parts": [[`1d8 + 3 + ${castingLevel}`, 'psychic']]
    });
    
    /** scale claws (negate own spell attack bonuses) */
    const claws = summonedToken.actor.items.getName("Claws");
    itemUpdates.push({
        "_id": claws.id,
        "data.attackBonus": `- @mod - @prof + ${summonerSpellAttackMod}`,
        "data.damage.parts": [[`1d10 + 3 + ${castingLevel}`, 'slashing']]
    });
    
    /** scale psychic slam (negate own spell attack bonuses) */
    const psychicSlam = summonedToken.actor.items.getName("Psychic Slam");
    itemUpdates.push({
        "_id": psychicSlam.id,
        "data.attackBonus": `- @mod - @prof + ${summonerSpellAttackMod}`,
        "data.damage.parts": [[`1d8 + 3 + ${castingLevel}`, 'psychic']]
    })

    const multiAttack = summonedToken.actor.items.getName("Multiattack");
    itemUpdates.push({
        "_id": multiAttack.id,
        "data.description.value": `The aberration makes ${Math.floor(castingLevel/2)} attacks`
    })

    return itemUpdates;
}
/* \CONFIG */
