/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */
(async ()=>{
    function spawnActor(scene, template) {
         
         let protoToken = game.actors.getName(item.name).data.token;
    
         protoToken.x = template.x;
         protoToken.y = template.y;
         
         // Increase this offset for larger summons
         protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
         protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);
         
         return canvas.tokens.createMany(protoToken,{});
     }
    
    async function deleteTemplatesAndSpawn (scene, template) {
        
        await spawnActor(scene,template);
        await canvas.templates.deleteMany([template._id]);
    }
        
    Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn);
    await item.roll();
    
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
