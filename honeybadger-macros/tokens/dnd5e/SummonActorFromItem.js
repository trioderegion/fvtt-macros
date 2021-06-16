/* Spawns a token from the actor with the same name as
 * the item at the location of the template.
 * Note: Intended for use with Item Macro. */

/* CONFIG */
const summonItem = item; //'item' defined by Item Macro
const actorNameToSpawn = item.name;
/* \CONFIG */

function drawTemplatePreview(type, distance){
    const data = {
        t: type,
        user: game.user.id,
        distance: distance,
        direction: 0,
        x: 0,
        y: 0,
        fillColor: game.user.color
    }
    
    const doc = new MeasuredTemplateDocument(data, {parent: canvas.scene});

    let template = new game.dnd5e.canvas.AbilityTemplate(doc);
    template.actorSheet = summonItem.actor.sheet;
    template.drawPreview();
}

function spawnActorAtTemplate(actorName, template) {
     const scene = template.parent;

     let protoToken = duplicate(game.actors.getName(actorName).data.token);

     protoToken.x = template.data.x;
     protoToken.y = template.data.y;
     
     // Increase this offset for larger summons
     protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
     protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);
     
     return canvas.scene.createEmbeddedDocuments("Token", [protoToken])
}

/** Factory function to generate a hook method to spawn a given actor name
 *  at a template's location */
function deleteTemplatesAndSpawn(actorName){
    return async (templateDocument) => {
        await spawnActorAtTemplate(actorName, templateDocument);
        await templateDocument.delete();
    }
}
    
Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn(actorNameToSpawn));
await summonItem.roll();
drawTemplatePreview('circle', 3.5);
