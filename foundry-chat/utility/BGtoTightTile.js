//by: kakaroto
// This macro will effectively set the vision area in a scene to the entire gridded area
// without having to shift any walls or tiles or tokens.
// It will do this by removing the scene padding by setting it to 0,
// then changing the scene dimensions so the overall scene keeps the exact same size
// It will also move the background image into a tile so it can be positiioned 
// at the same position as it was when the scene had padding


const width = canvas.scene.data.width;
const height = canvas.scene.data.height;
const grid = canvas.scene.data.grid;
const img = canvas.scene.data.img;
const padding = canvas.scene.data.padding;
const paddingX = Math.ceil(width * padding / grid) * grid;
const paddingY = Math.ceil(height * padding / grid) * grid;

await canvas.scene.update({img: null, width: width + 2 * paddingX, height: height + 2 * paddingY, padding: 0})
if (img) {
  const minZ = canvas.scene.data.tiles.length ? Math.min(...canvas.scene.data.tiles.map(t => t.z)) : 0;
  await canvas.scene.createEmbeddedEntity('Tile', {width, height, img, scale: 1, rotation: 0, locked: true, hidden: false, x: paddingX, y: paddingY, z: minZ - 1});
}