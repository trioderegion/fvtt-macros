/**************************************************************************
MIT License

Copyright (c) 2021 Matthew Haentschke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
****************************************************************************/

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

    await template.parent.updateEmbeddedDocuments("Token", updates, {animate: false});
    await template.parent.deleteEmbeddedDocuments("MeasuredTemplate", [template.id, rangeId])
}

Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove );
drawTemplatePreview('circle',3.5);
