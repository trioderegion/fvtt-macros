/**
 * Takes all selected tokens and adds them to the combat tracker. Then rolls group initative for all NPC tokens.
 * Note: Core group rolling logic taken from the wonderfully simple module "Group Initiative" by Thorni
 */


async function rollGroupInitiative(creatures) {
  console.log('Rolling initiative!');
  // Split the combatants in groups based on actor id.
  const groups = creatures.reduce(
    (g, combatant) => ({
      ...g,
       [combatant.actor.id]: (g[combatant.actor.id] || []).concat(combatant._id),
    }),
    {}
  );

  // Get first Combatant id for each group
  const ids = Object.keys(groups).map(key => groups[key][0]);

  const messageOptions = {
    flavor: "Rolling for Initiative! (grouped)",
  };

  // Roll initiative for the group leaders only.
  await game.combat.rollInitiative(ids, {messageOptions});

  // Prepare the others in the group.
  const updates = creatures.reduce((updates, {_id, initiative, actor}) => {
    const group = groups[actor._id];
    if (group.length <= 1 || initiative) return updates;

    // Get initiative from leader of group.
    initiative = game.combat.getCombatant(group[0]).initiative;

    updates.push({_id, initiative});
    return updates;
  }, []);

  // Batch update all other combatants.
  game.combat.updateEmbeddedEntity('Combatant', updates);
}

async function main() {
  await canvas.tokens.toggleCombat();
  await rollGroupInitiative(game.combat.combatants.filter(combatant => combatant.actor.data.type == "npc"))
}
main();