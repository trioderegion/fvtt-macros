/* Requires Squadron
 * Update spawned actor name as needed
 */
const leaderId = token.id;
const leaderName = token.name;
const sceneId = canvas.scene.id;

const updates = {token: {name: 'Fred'}, actor: {name: `${leaderName}'s Familiar`}};

const callbacks = {
  post: async (_ , tokenDoc) => { 
    await squadron.follow(leaderId, tokenDoc.id, sceneId, squadron.CONST.DOWN);
  }
};

await warpgate.spawnAt({
  x: token.x + canvas.grid.size,
  y: token.y 
 }, "Owl", updates, callbacks, {collision: false})
