async function promptInit(){
  let updates = [];
  for( let thisCombatant of game.combat.combatants){

    const content = `<div class="form-group dialog distance-prompt">
      <label>${thisCombatant.name}'s initiative:</label> 
      <input type="number" name="init" value="${thisCombatant.initiative}"/></div>`;
    await new Dialog({
        title: "Manual Init",
        content: content,
        default: 'ok',
        buttons: {
          ok: {
            icon: '<i class="fas fa-check"></i>',
            label: 'Update Initiative',
            default: true,
            callback: html => {
              const newinit = html.find('.distance-prompt.dialog [name="init"]')[0].value;
              updates.push({id: thisCombatant._id, initiative: newinit});
            },
          }
        }
      }).render(true);
    });
  }

  game.combat.updateCombatant(updates);
}

promptInit();
