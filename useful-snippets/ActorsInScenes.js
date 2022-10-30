/* By Guillaume#7445
 * gets all unique actor ids from tokens
 * on any scene in the world
 */

// Get actorIds references of all tokens on all scenes
let arr2dActorIds = game.scenes.map (scene => scene.getEmbeddedCollection('Token').map( token => token.data.actorId ));

// Flatten 2d array to 1d
let arrActorIds = arr2dActorIds.deepFlatten();

// Remove duplicates
let arrUniqueActorIds = [...new Set(arrActorIds.map(a => JSON.stringify(a)))].map(a => JSON.parse(a))