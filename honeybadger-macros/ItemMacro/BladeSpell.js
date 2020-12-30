async function RollDamage(weapon, spell){
    await weapon.rollDamage();
    
    //await spell.options.actor.useSpell(spell);
    //debugger
    
    await spell.rollDamage();
    
    let confirmSecondary = new Dialog({
      title: `Secondary targets hit?`,
      content: ``,
      buttons: {
        level1: {
          label: `Yes`,
          callback: () => {
            spell.rollDamage({event:event, spellLevel:null, versatile:true, options:{}});
          }
        },
        close: {
          label: `No`
        },
      },
      default: "close",
      close: () => {}
    });

    confirmSecondary.render(true)
}

async function EchoBlade() {
    const gsword = item.options.actor.items.getName("Greatsword");
    debugger
    const echo = item;
    if (!gsword || !echo) { return }
    await gsword.rollAttack();


    let dialogEditor = new Dialog({
      title: `Did the attack hit?`,
      content: ``,
      buttons: {
        level1: {
          label: `Yes`,
          callback: () => {
            RollDamage(gsword, echo);
          }
        },
        close: {
          label: `No`
        },
      },
      default: "close",
      close: () => {}
    });

    dialogEditor.render(true)
}

EchoBlade();