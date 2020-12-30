/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */
function swapToActor(scene, template) {
     
     let protoToken = game.actors.getName(item.name).data.token;

     protoToken.x = template.x;
     protoToken.y = template.y;
     
     
     protoToken.x -= scene.data.grid/2;
     protoToken.y -= scene.data.grid/2;
     
     canvas.tokens.createMany(protoToken,{});
     
     return false;
 }
 
Hooks.once("preCreateMeasuredTemplate", swapToActor)
 
item.options.actor.useSpell(item);