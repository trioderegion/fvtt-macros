/** War wizard's capture Power Surge. Used in Dispel Magic or Counterspell
    NOTE: assumes power surges are tracked in the primary resource */
    
(async function(){   
   await item.roll(); 
    
    let confirmCapture = new Dialog({
      title: `Spell or effect successfully ended?`,
      content: ``,
      buttons: {
        level1: {
          label: `Yes`,
          callback: async () => {
            await item.options.actor.update({
                "data.resources.primary.value" : item.options.actor.data.data.resources.primary.value + 1
                });
            
            await ChatMessage.create({
                content: `<i>A surge is captureed!</i>`,
                speaker: ChatMessage.getSpeaker(item.options.actor)
            });
          }
        },
        close: {
          label: `No`
        },
      },
      default: "close",
      close: () => {}
    });

    confirmCapture.render(true)
 })();
