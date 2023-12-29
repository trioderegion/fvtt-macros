/**
 * Usage: Set scene width to desired target value (this may be increased
 *   up to the size of the largest token). Fill desired pack keys (`displayPacks`)
 *   from which to spawn tokens on the current scene according to descending height.
 *
 *   Be patient, and pray to your gods that the server survives.
 */
const displayPacks = ['pf2e.pathfinder-bestiary']

let templateActor = game.actors.getName('GalleryActor');
if (!templateActor) {
  templateActor = await Actor.create({name:'GalleryActor', type:'npc'})
}

await canvas.scene.deleteEmbeddedDocuments('Token', [], {deleteAll: true});

/* get out the hammer */
ui.notifications.info('Gallery creation in progress. Please wait, this will take a while.');

/* collect all document identifiers from packs */
const allActorIds = (await Promise.all(displayPacks.flatMap( key => { 
  return game.packs.get(key).getIndex().then( index => index.map( entry => ({id: entry._id, pack: key})) );
}))).flat();

/* retrieve each document individually, extract its proto token data,
 * substitute our template actor ID, and populate the token actor's
 * size field so that the pf2e system will automatically size if
 * the token is configured for it.
 */
const allTokens = [];
for( const id of allActorIds ) {
  const doc = await game.packs.get(id.pack).getDocument(id.id);
  const token = await doc.getTokenDocument({
    actorData: {
      'system.traits.size.value': doc.system.traits.size.value
    },
    actorId: templateActor.id,
    actorLink: false
  });

  allTokens.push(token.toObject());
}

/* pf2e actor compendiums do not seem to include
 * the prototoken data...or I'm missing something.
 * Regardless, map the sizes to the system size keys.
 */
const sizeVal = {
  grg: 4,
  huge: 3,
  lg: 2,
  med: 1,
  sm: 1,
  tiny: 0.5,
}

const sizeFromData = (data) => sizeVal[data.actorData.system.traits.size.value];

allTokens.sort( (left, right) => sizeFromData(right) - sizeFromData(left) );

console.log('Sorted: ',allTokens);

/* Generator function for token position placement.
 * On each iteration, will return the final token data
 * that should be used for creation
 */
function* nextToken(initialPos, sceneDimensions, tokenList) {
  let current = {x: 0, y:0, tokenIndex: 0, size: sizeFromData(tokenList[0])};

  while(current.tokenIndex < tokenList.length) {

    /* keep going left to right until our origin runs over the scene boundary */
    while( (current.x < sceneDimensions.sceneWidth) && 
            current.size == sizeFromData(tokenList[current.tokenIndex]) ) {
      
      //stamp left to right
      const token = tokenList[current.tokenIndex];
      foundry.utils.mergeObject(token, {x: current.x + initialPos.x, y: current.y + initialPos.y});

      //prep next iteration
      current.x += (sizeFromData(token) * sceneDimensions.size);
      current.size = sizeFromData(token);
      current.tokenIndex++;

      yield token;

      if(current.tokenIndex >= tokenList.length) return;

    }
    /* We have run over our horizontal boundary, reset and move a row down
     * based on current token size.
     */
    current.x = 0;
    current.y += (current.size * sceneDimensions.size);
    current.size = sizeFromData(tokenList[current.tokenIndex]);
  }

  return;
}

const sceneDimensions = canvas.scene.dimensions;

/* seed the token data generator with initial position and other scene data
 * plus all of our gathered token creation data
 */
const stamper = nextToken({x: sceneDimensions.sceneX, y: sceneDimensions.sceneY}, sceneDimensions, allTokens)

const createdTokens = await canvas.scene.createEmbeddedDocuments('Token', Array.from(stamper));

/* find our maximum dimensions */
const dimensions = createdTokens.reduce( (acc, curr) => {
  acc.width = Math.max(acc.width, curr.bounds.right - canvas.scene.dimensions.sceneX);
  acc.height = Math.max(acc.height, curr.bounds.bottom - canvas.scene.dimensions.sceneY);
  return acc;
}, {width:0, height:0});

ui.notifications.info(`Created ${createdTokens.length}. Updating scene to ${dimensions.width}x${dimensions.height}.`);

/* cache data in case of invalidation */
const originalTop = canvas.scene.dimensions.sceneY;
const originalLeft = canvas.scene.dimensions.sceneX;

const createdIds = createdTokens.map( token => token.id );

/* abuse local updates to have foundry recalculate the usable canvas start (sceneX/Y) */
canvas.scene.updateSource(dimensions);

/* compute the needed token offset to fit the new dimensions (padding mainly) */
const offsetY = canvas.scene.dimensions.sceneY - originalTop;
const offsetX = canvas.scene.dimensions.sceneX - originalLeft;

console.log('Original: ', originalTop, originalLeft, 'New: ', canvas.scene.dimensions.sceneY, canvas.scene.dimensions.sceneX);

/* shift tokens and force a scene update */
await canvas.tokens.updateAll( (token) => ({y: token.document.y + offsetY, x: token.document.x + offsetX}), null, {animate:false} );

await canvas.scene.update(dimensions, {diff:false});
