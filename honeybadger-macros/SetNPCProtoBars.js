/* This will set every NPC's prototype token to show bars on hover
 * and attach hp to bar 1 .
*/

const updates = game.actors.filter(a => a.data.type === "npc").map(a => ({
    _id: a.id,
    "token.bar1.attribute": "attributes.hp",
    "token.bar2.attribute": "",
    "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    "token.displayBars": CONST.TOKEN_DISPLAY_MODES.HOVER
}));

Actor.update(updates);