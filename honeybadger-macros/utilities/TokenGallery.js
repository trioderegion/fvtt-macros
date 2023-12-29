/**
 * Usage: Set scene width to desired target value (this may be increased
 *   up to the size of the largest token). Fill desired pack keys (`displayPacks`)
 *   from which to spawn tokens on the current scene according to descending height.
 *
 *   Be patient, and pray to your gods that the server survives.
 */
let selection;
await Dialog.wait({
  title: 'Compendium ID',
  content: `<label>Enter Compendium ID, the Actors folder name, or "actors":</label>
    <input type="text" id="selection"></input>`,
  buttons: {
    ok: {
      label: 'Ok',
      callback: async (html) => {
        selection = html.find('#selection')[0].value;
      },
    },
  },
  default: 'ok',
});

/* get out the hammer */
ui.notifications.info('Gallery creation in progress. Please wait, this will take a while.');

await canvas.scene.deleteEmbeddedDocuments('Token', [], { deleteAll: true });

/* collect all document identifiers from packs */
const allActorUuids =
  (await game.packs
    .get(selection)
    ?.getIndex()
    ?.then((index) => index.map((entry) => entry.uuid))) ||
  game.folders
    .find((f) => f.name === selection && f.type === 'Actor')
    ?.documentCollection?.map((a) => a.uuid) ||
  selection === 'actors'
    ? game.actors.map((a) => a.uuid)
    : [];

let templateActor = game.actors.getName('GalleryActor');
if (!templateActor) {
  templateActor = await Actor.create({ name: 'GalleryActor', type: 'npc' });
}

/* retrieve each document individually, extract its proto token data,
 * substitute our template actor ID, and populate the token actor's
 * size field so that the pf2e system will automatically size if
 * the token is configured for it.
 * if the size field doesn't exist, don't do anyhting.
 */
const allTokens = [];
for (const uuid of allActorUuids) {
  const doc = await fromUuid(uuid);
  const token = await doc.getTokenDocument({
    delta: {
      'system.traits.size.value': doc.system?.traits?.size?.value,
    },
    actorId: templateActor.id,
    actorLink: false,
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
};

const sizeFromData = (data) =>
  data.delta?.system?.traits?.size?.value
    ? sizeVal[data.delta?.system?.traits?.size?.value]
    : data.height;

allTokens.sort((left, right) => sizeFromData(right) - sizeFromData(left));

console.log('Sorted: ', allTokens);

/* Generator function for token position placement.
 * On each iteration, will return the final token data
 * that should be used for creation
 */
function* nextToken(initialPos, sceneDimensions, tokenList) {
  const current = { x: 0, y: 0, tokenIndex: 0, size: sizeFromData(tokenList[0]) };

  while (current.tokenIndex < tokenList.length) {
    /* keep going left to right until our origin runs over the scene boundary */
    while (
      current.x < sceneDimensions.sceneWidth &&
      current.size == sizeFromData(tokenList[current.tokenIndex])
    ) {
      // stamp left to right
      const token = tokenList[current.tokenIndex];
      foundry.utils.mergeObject(token, {
        x: current.x + initialPos.x,
        y: current.y + initialPos.y,
      });

      // prep next iteration
      current.x += sizeFromData(token) * sceneDimensions.size;
      current.size = sizeFromData(token);
      current.tokenIndex++;

      yield token;

      if (current.tokenIndex >= tokenList.length) return;
    }
    /* We have run over our horizontal boundary, reset and move a row down
     * based on current token size.
     */
    current.x = 0;
    current.y += current.size * sceneDimensions.size;
    current.size = sizeFromData(tokenList[current.tokenIndex]);
  }

  return;
}

const sceneDimensions = canvas.scene.dimensions;

/* seed the token data generator with initial position and other scene data
 * plus all of our gathered token creation data
 */
const stamper = nextToken(
  { x: sceneDimensions.sceneX, y: sceneDimensions.sceneY },
  sceneDimensions,
  allTokens,
);

const createdTokens = await canvas.scene.createEmbeddedDocuments('Token', Array.from(stamper));

ui.notifications.info(`Created ${createdTokens.length} Tokens.`);

await Dialog.confirm({
  title: 'Please check everything',
  content: `<p>once you are finished with the inspection, close this window to restore the scene and clean up the test actor</p>`,
});

/* get out the hammer reloaded */
await canvas.scene.deleteEmbeddedDocuments('Token', [], { deleteAll: true });
await Actor.deleteDocuments([templateActor.id]);
