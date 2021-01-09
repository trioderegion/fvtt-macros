/** Converts all selected tokens to a tile with the same 
 * image and relative size and layers smaller tiles
 * on top of larger ones (thanks cs96and). Deletes original token. */

async function convertDelete(){
    const grid_size = canvas.grid.size;
    const newTiles = canvas.tokens.controlled.map( token => {
        return {
          img: token.data.img,
          width: token.data.width*grid_size,
          height: token.data.height*grid_size,
          scale: token.data.scale,
          x: token.data.x,
          y: token.data.y,
          z: 500-100*token.data.width*token.data.height,
          rotation: 0,
          hidden: false,
          locked: false
        }});

    Tile.create(newTiles);
    
    const idsDelete = canvas.tokens.controlled.map(e => {return e.id});
    canvas.tokens.deleteMany(idsDelete);
}

convertDelete();