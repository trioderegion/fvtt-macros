let updates = [];
for( let thisCombatant of game.combat.combatants){

  await new Promise( resolve => { 
    const content = `<div class="form-group dialog distance-prompt">
      <label>${thisCombatant.name}'s initiative:</label> 
      <input type="number" name="init" value="${thisCombatant.initiative}"/></div>`;
    
    new Dialog({
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
              resolve(updates.push({_id: thisCombatant.id, initiative: newinit}));
            },
          }
        }
      }).render(true);
    })
}

await game.combat.updateEmbeddedDocuments('Combatant', updates);
