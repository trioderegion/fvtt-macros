/** Will act funny if multiple tokens of the same PC are on the board */
async function MistyStep(){
    let token = item.actor.getActiveTokens()[0];
    
    await item.actor.useSpell(item);
    
    let range = MeasuredTemplate.create({
        t: "circle",
        user: game.user._id,
        x: token.x + canvas.grid.size/2,
        y: token.y + canvas.grid.size/2,
        direction: 0,
        distance: 30,
        borderColor: "#FF0000",
        //fillColor: "#FF3366",
      });
    
    range.then(result => {
        let rangeId = result.data._id;
        let templateData = {
                t: "circle",
                user: game.user._id,
                distance: 3.5,
                direction: 0,
                x: 0,
                y: 0,
                fillColor: game.user.color
            }
    
        async function deleteTemplatesAndMove (scene, template) {
            
            let updates = item.actor.getActiveTokens().map( t => {
                return {_id : t.id,
                        x : template.x - canvas.grid.size/2,
                        y : template.y - canvas.grid.size/2}
            })
            
            await canvas.tokens.updateMany(updates)
            await canvas.templates.deleteMany([template._id, rangeId])
        }
        
        Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove )
        
        let template = new game.dnd5e.canvas.AbilityTemplate(templateData)
        template.actorSheet = token.actor.sheet;
        template.drawPreview()
    });
}

MistyStep();