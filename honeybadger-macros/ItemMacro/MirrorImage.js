async function promptHit(acVal) {
    
    return await new Promise((resolve) => {
        let dialogEditor = new Dialog({
          title: `Confirm hit on duplicate`,
          content: '',
          buttons: {
            hit: {
              label: `Attack hits AC ${acVal}`,
              callback: () => {
                resolve(true);
              }
            },
            miss: {
              label: `Miss!`,
              callback: () => {
                resolve(false);
            },
          },
          //default: () => {resolve(false)}
        }});
    
        dialogEditor.render(true);
        });
}

async function HandleMirrorImage(spell) {
    let actor = spell.options.actor;
    const originString = `Actor.${actor.id}.OwnedItem.${spell.id}`;
    
    /** if there is no mirror image, then we should cast and create the effect */
    let existingEffect = actor.effects.find( effect => effect.data.origin == originString )
    if(!existingEffect) {
        
        /** cast the spell and allow for cancelling */
        if(!(await spell.roll())){
            return; 
        }
        //create it at the fake stage 4 
        let effectData = {
          label : `Mirror Image`,
          icon : "icons/svg/statue.svg",
          duration: {rounds: 10},
          origin: originString,
          //tint: "##00ff00",
          flags: {world: {miStage: 4} }
          };
          
         const newId = await actor.createEmbeddedEntity("ActiveEffect", effectData);
         existingEffect = actor.effects.get(newId._id);
    }
    
    const currentStage = existingEffect.getFlag('world','miStage');
    
    /** placeholders for final result information */
    let echo;
    let newTint;
    let newStage = currentStage;
    
    /** roll the d20 and see if it hits a duplicate */
    let dupeHit = false;
    const duplicateAC = 10+getProperty(actor, "data.data.abilities.dex.mod");
    const d20result = currentStage > 3 ? 20 : (await new Roll("1d20").roll()).total;

    switch (currentStage) {
        case 1:
            // > 10 = shatter
            if (d20result > 10) dupeHit = true; 
            break;
        case 2:
            // > 7 = shatter
            if (d20result > 7) dupeHit = true;
            break;
        case 3:
            // >5 shatter
            if (d20result > 5) dupeHit = true; 
            break;
        case 4:
            newStage = 3;
            break;
        default: break;
    }
    
    //check if we hit, if not, rollback the new stage update
    if(dupeHit){
        newStage = await promptHit(duplicateAC) ? newStage-1 : newStage;
    }
    
    if (currentStage != newStage){
        /** if we have changed stages, assume a hit and set the echo */
        /** note: stage 3 is a special case here and assumes it was cast */
        switch (newStage) {
            case 0:
                echo = `[[${d20result}]] All duplicates destroyed!`;
                break;
            case 1: 
                newTint = "#ff0000";
                echo = `[[${d20result}]] One duplicate remains...`;
                break;
            case 2: 
                newTint = "#ffff00";
                echo = `[[${d20result}]] Shattered! Two duplicates remain`;
                break;
            case 3: 
                newTint = "#00ff00";
                echo = `Three duplicates appear!`;
                break;
            default: newTint = "#ffffff", echo = "so confused"; newStage = -1; break;
        }
    } else {
        /** otherwise, check if the attack missed the dupe, or hit us */
        newTint = existingEffect.data.tint;
        if(dupeHit){
            echo = `[[${d20result}]] The attack is redirected to a duplicate and misses!`
        } else {
            echo = `[[${d20result}]] The attack hits you!`
        }
            
    }
    
    /** craft the update data (may be ignoreed if stage = 0) */
    let effectData = {
      _id: existingEffect.id,
      label : `Mirror Image (${newStage})`,
      tint: newTint,
      flags: {world: {miStage: newStage} }
      };
      
    /** do we update the stage, or delete the effect entirely? */
    if (newStage > 0){
        await actor.updateEmbeddedEntity("ActiveEffect", effectData);
    } else {
        await actor.deleteEmbeddedEntity("ActiveEffect", existingEffect.id);
    }
    
    /** report the results */
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({actor: actor}),
      content: echo,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE
      });
         
}

HandleMirrorImage(item);