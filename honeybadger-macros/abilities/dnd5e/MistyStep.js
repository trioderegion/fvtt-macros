/** Intend for use with item macro.
 * Will draw a 30 foot range to indicate
 * range of Misty Step, then draw a small
 * circular template preview. Place this 
 * preview anywhere to move all tokens of
 * this actor to that location.
 * /

/* CONFIG */
let token = item.actor.getActiveTokens()[0];
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
    template.actorSheet = item.actor.sheet;
    template.drawPreview();
}

await item.roll();

let range = await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
                    t: "circle",
                    user: game.user.id,
                    x: token.x + canvas.grid.size/2,
                    y: token.y + canvas.grid.size/2,
                    direction: 0,
                    distance: 30,
                    borderColor: "#FF0000",
                    //fillColor: "#FF3366",
                  }]);
                  
const rangeId = range[0].id;

async function deleteTemplatesAndMove (template) {
    
    let updates = item.actor.getActiveTokens().map( t => {
        return {_id : t.id,
                x : template.data.x - canvas.grid.size/2,
                y : template.data.y - canvas.grid.size/2}
    })

    await template.parent.updateEmbeddedDocuments("Token", updates);
    await template.parent.deleteEmbeddedDocuments("MeasuredTemplate", [template.id, rangeId])
}

Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove );
drawTemplatePreview('circle',3.5);
