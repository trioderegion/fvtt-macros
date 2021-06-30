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
 * Initial setup is intended for use with item macro. Midi support enabled
 *   by adjusting the 'module' config to MODULE.MIDI
 * 
 * When used via other means, pay attention to 'rollItemGetLevel' as it
 *   may need to replaced or modified to grab the item level if its not
 *   being rolled by this macro directly (ex. midiqol onuse macro)
 * 
 * The const values in the CONFIG section are arbitrary values and
 *   all may not be used depending on the scaling needed.
 * 
 ************************************************************************/

const MODULE = {
    ITEM_MACRO : "item-macro",
    MIDI : "midi"
}

/* CONFIG */
const module = MODULE.ITEM_MACRO
const summonItem = module == MODULE.ITEM_MACRO ? item : args[0].item;
const actorNameToSpawn = summonItem.name;
const summonerActor = module == MODULE.ITEM_MACRO ? summonItem.actor : args[0].actor;
const summonerDc = summonerActor.data.data.attributes.spelldc;
const summonerSpellAttackMod = summonerDc - 8; //assumes no bonus to spellDC or spell attack bonus

/** needs to return a plain update object for this specific summoned token 
    Note: this can be an empty object to skip updating the token */
function tokenUpdateGenerator(castingLevel, summonerActor, summonedToken){
    return {
      //token update data
    }
}

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

/** Get the level of the spell, depending on module used */
let castingLevel = 0;
switch (module) {
    case MODULE.ITEM_MACRO:
        castingLevel = await rollItemGetLevel(item);
        break;
    case MIDI:
        castingLevel = args[0].spellLevel;
}
const 

/** Insert our primary logic hook */
Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn(actorNameToSpawn, summonerActor, castingLevel));

/** Initiate the process with a "targeting" template */
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

async function updateSummon(summonedDocument, summonerActor, castingLevel){

    /** gather the user defined updates */
    const itemsUpdate = itemUpdateGenerator(castingLevel, summonerActor, summonedDocument);
    const summonUpdate = actorUpdateGenerator(castingLevel, summonerActor, summonedDocument);
    const tokenUpdate = tokenUpdateGenerator(castingLevel, summonerActor, summonedDocument);

    /** perform the updates */
    await summonedDocument.update(tokenUpdate);
    await summonedDocument.actor.update(summonUpdate);
    return summonedDocument.actor.updateEmbeddedDocuments("Item", itemsUpdate);
}

/** Factory function to generate a hook method to spawn a given actor name
 *  at a template's location */
function deleteTemplatesAndSpawn(actorName, summonerActor, castingLevel){
    return async (templateDocument) => {
        const summonedDoc = (await spawnActorAtTemplate(actorName, templateDocument))[0];
        await templateDocument.delete();
        await updateSummon(summonedDoc, summonerActor, castingLevel);
    }
}
/* \SUPPORTING FUNCTIONS */
