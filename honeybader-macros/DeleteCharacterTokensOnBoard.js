/** Deletes all tokens on the current scene of type "character".
    useful for cleaning up test actors while developing maps */

let idsToDel = canvas.tokens.placeables.filter( toke => toke.actor.data.type == "character").map( toke => toke.id);

async function DeleteTokens(idList) {
    for (let tokenId of idList){
       await canvas.scene.deleteEmbeddedEntity("Token", tokenId);
    }
}

DeleteTokens(idsToDel);
ui.notifications.info(`Removed ${idsToDel.length} character tokens from the board`);