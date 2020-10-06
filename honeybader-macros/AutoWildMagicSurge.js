console.log("Registering detection of wild magic surges...");

Hooks.on("preUpdateActor", async (actor, update, options, userId) => {
  const origSlots = actor.data.data.spells;   

  /** find the spell level just cast */
  const spellLvlNames = ["spell1","spell2","spell3","spell4","spell5","spell6", "spell7","spell8","spell9"];
  let lvl = spellLvlNames.findIndex(name => { return getProperty(update,"data.spells."+name) });
  console.log("Level "+ (lvl+1) +"spell detected");

  const preCastSlotCount = getProperty(origSlots, spellLvlNames[lvl]+".value");
  const postCastSlotCount = getProperty(update, "data.spells."+spellLvlNames[lvl]+".value");
  const bWasCast = preCastSlotCount - postCastSlotCount > 0;


  /** USAGE NOTE: replace the i.name comparison with the wild magic feature name on your sheet */
  const wmFeature = actor.items.find(i => i.name === "Wild Magic: Wild Magic Surge") !== null

  lvl++;
  console.log("A "+lvl+" slot was expended("+bWasCast+") by a user with the Wild Magic Feature("+wmFeature+")");
  if(wmFeature && bWasCast && lvl>0)
  {
      /** lets go baby lets go */
      console.log("Rolling for surge...");

      /** USAGE NOTE: Any code to handle the mechanical process of rolling Wild Surge goes here */
      game.macros.getName("fWildMagicSurge_spellLevel").execute(lvl);
  }
  
});
