/* CONFIG */
const module = MODULE.ITEM_MACRO
const summonItem = item; //'item' defined by Item Macro
const actorNameToSpawn = summonItem.name;
const summonerActor = summonItem.parent;
const summonerDc = summonerActor.data.data.attributes.spelldc;
const summonerSpellAttackMod = summonerDc - 8;

/** needs to return a plain update object for this specific summoned token 
    Note: this can be an empty object to skip updating the token */
function tokenUpdateGenerator(castingLevel, summonerActor, summonedToken){
    return {
      //token update data
    }
}
/** needs to return a plain update object for this specific summoned actor */
function actorUpdateGenerator(castingLevel, summonerActor, summonedToken){
    return {
        "name" : `${summonerActor.name}'s ${actorNameToSpawn}`,
        "data.attributes.ac.value": castingLevel
    };
}

/** needs to return an array of item updates (including '_id' field) */
function itemUpdateGenerator(castingLevel, summonerActor, summonedToken){
    const scalingItem = summonedToken.actor.items.getName("Flame Burst");
    return [{
        "_id" : scalingItem.id,
        "data.damage.parts": [[`${castingLevel}d6`,"fire"]],
        "data.save": {ability:"dex", dc:summonerDc, scaling:"flat"}        
    }]
}
/* \CONFIG */
