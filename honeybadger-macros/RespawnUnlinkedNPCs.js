// DANGER ZONE - BE SURE YOU WANT TO DO THIS 

// Will create a fresh copy of all selected unlinked NPCs (or all on board if none selected).
// Main use is for when you correct an NPC in the sidebar and need to replace all current tokens.
// Searches by Token Name and tries to match to an Actor Name in the sidebar
// Spawns those it can match and then deletes only their original tokens

function findUnlinked (token) { 
   return token.actor.data.type == "npc" && token.data.actorLink == false
};

// get the list of tokens to respawn
const tokens = canvas.tokens.controlled.length > 0 ? canvas.tokens.controlled.filter(findUnlinked) : canvas.tokens.placeables.filter( findUnlinked );

// generated the info needed
let spawnInfo = tokens.map( token => {
    let protoToken = duplicate(game.actors.getName(token.actor.name)?.data.token);
    if (protoToken){
        protoToken.deleteId = token.id;
        protoToken.x = token.x;
        protoToken.y = token.y;
    }
    return protoToken;
})

spawnInfo = spawnInfo.filter( info => !!info );
const deleteIds = spawnInfo.map( info => info.deleteId );

(async ()=>{
    await canvas.tokens.createMany(spawnInfo);
    await canvas.tokens.deleteMany(deleteIds);
    ui.notifications.info(`Respawned ${spawnInfo.length} tokens`);
})();