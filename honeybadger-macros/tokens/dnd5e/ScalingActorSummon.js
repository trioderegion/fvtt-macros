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

/*********************** USAGE ********************************************
 * Initial setup is intended for use with item macro as it defines 'item'.
 * 
 * When used via other means, pay attention to 'rollItemGetLevel' as it
 *   may need to replaced or modified to grab the item level if its not
 *   being rolled by this macro directly (ex. midiqol onuse macro)
 * 
 * The const values in the CONFIG section are arbitrary values and
 *   all may not be used depending on the scaling needed.
 * 
 ************************************************************************/

/* CONFIG */
const summonItem = item; //'item' defined by Item Macro
const actorNameToSpawn = summonItem.name;
const summonerActor = summonItem.actor;
const summonerDc = summonerActor.data.data.attributes.spelldc;
const summonerSpellAttackMod = summonerDc - 8; //assumes no bonus to spellDC or spell attack bonus

/** needs to return a plain update object for this specific summoned actor 
    Note: this can be an empty object to skip updating the actor */
function actorUpdateGenerator(castingLevel, summonerActor, summonedToken){
    return {
      //actor update data
    };
}

/** needs to return an array of item updates (including '_id' field) 
    Note: this can be an empty array to skip updating the actor's items */
function itemUpdateGenerator(castingLevel, summonerActor, summonedToken){
    let itemUpdates = [];
    //populate array of item updates 
    return itemUpdates;
}
/* \CONFIG */

/* CORE LOGIC */
const castingLevel = await rollItemGetLevel(summonItem);
Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn(actorNameToSpawn, summonerActor, castingLevel));
drawTemplatePreview('circle', 3.5);
/* \CORE LOGIC */

/* SUPPORTING FUNCTIONS */
async function rollItemGetLevel(item){
    const result = await item.roll();
    // extract the level at which the spell was cast
    if(!result) return 0;
    const content = result.data.content;
    const level = content.charAt(content.indexOf("data-spell-level")+18);
    return parseInt(level);
}

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
    template.actorSheet = summonerActor.sheet;
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

async function scaleSummon(summonedDocument, summonerActor, castingLevel){
    const itemsUpdate = itemUpdateGenerator(castingLevel, summonerActor, summonedDocument);
    const summonUpdate = actorUpdateGenerator(castingLevel, summonerActor, summonedDocument);
    await summonedDocument.actor.update(summonUpdate);
    return summonedDocument.actor.updateEmbeddedDocuments("Item", itemsUpdate);
}

/** Factory function to generate a hook method to spawn a given actor name
 *  at a template's location */
function deleteTemplatesAndSpawn(actorName, summonerActor, castingLevel){
    return async (templateDocument) => {
        const summonedDoc = (await spawnActorAtTemplate(actorName, templateDocument))[0];
        await templateDocument.delete();
        await scaleSummon(summonedDoc, summonerActor, castingLevel);
    }
}
/* \SUPPORTING FUNCTIONS */
