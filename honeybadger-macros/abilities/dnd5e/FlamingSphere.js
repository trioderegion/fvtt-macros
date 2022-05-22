/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/* Expects an actor named "flaming sphere" with a save based feature named "Flame Burst" as its attack to scale */

/* helper function to roll the item and get the spell level */
const level = await warpgate.dnd5e.rollItem(item);

/* Computing values needed for scaling attacks/DCs */
const save = item.parent.data.data.attributes.spelldc;

/* construct item updates */
const updates = {embedded: {Item:{ "Flame Burst":{
    "data.damage.parts": [[`${level}d6`,"fire"]],
    "data.save": {ability:"dex", dc:save, scaling:"flat"}
}}}}

await warpgate.spawn("Flaming Sphere", updates)
