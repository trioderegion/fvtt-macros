/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */

/** Version 2: Now scales the flaming sphere's save and damage appropriately */
// Setup: "Item Name" Actor with a single feature named "Flame Burst" Setup
//        as "Action Type = Save".
// Scaling: 1d6 damage per spell level, flat DC based on caster
(async ()=>{
    async function spawnActor(scene, template) {
         
         let protoToken = duplicate(game.actors.getName(item.name).data.token);
        
         protoToken.x = template.x;
         protoToken.y = template.y;
         
         // Increase this offset for larger summons
         protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
         protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);
         
         return canvas.tokens.createMany(protoToken,{});
    }
     
    const save = item.options.actor.data.data.abilities.int.mod + item.options.actor.data.data.attributes.prof + 8;
    
    async function scaleSphere(sphereId){
        let sphere = canvas.tokens.get(sphereId);
        let flameburst = sphere.actor.items.getName("Flame Burst");
        
        const update = {
            "data.damage.parts": [[`${level}d6`,"fire"]],
            "data.save": {ability:"dex", dc:save, scaling:"flat"}
        }
        
        return flameburst.update(update);
    }
    
    async function deleteTemplatesAndSpawn (scene, template) {
        
        const tokenId = (await spawnActor(scene,template))._id;
        await canvas.templates.deleteMany([template._id]);
        await scaleSphere(tokenId);
    }
        
    Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn);
    let result = await item.roll();
    
    // extract the level at which the spell was cast
    if(!result) return;
    let content = result.data.content;
    let level = content.charAt(content.indexOf("data-spell-level")+18);

    let template = new game.dnd5e.canvas.AbilityTemplate({
                t: "circle",
                user: game.user._id,
                distance: 3.5,
                direction: 0,
                x: 0,
                y: 0,
                fillColor: game.user.color
            });
    template.actorSheet = item.options.actor.sheet;
    template.drawPreview();
})();