//GM ONLY MACRO (players cannot delete)
//Will find and delete a "Dropped Torch" within 1 grid unit and apply vision changes
//to the controlled token.
//author:honeybadger#2614

if (canvas.tokens.controlled.length !== 1) {
  ui.notifications.error("Please select only one token to pick up a torch.");
  return;
}

// collect all tokens named "Dropped Torch"
let canvasTokens = canvas.scene.getEmbeddedCollection('Token');
let droppedTorches = canvasTokens.filter(candidate => candidate.name == "Dropped Torch");
if(droppedTorches.length === 0){
  ui.notifications.error("There are no Dropped Torches on this scene!");
}

//grab the selected token's position (we know only one is selected)
let selectedToken = canvas.tokens.controlled[0];

//create the search reducer (use 5e rules: distance = max(distX, distY)
const findClosestTorch = (closestTorch, currentTorch) => {
   //X,Y distance current torch
   let distX = Math.abs(currentTorch.x - selectedToken.x);
   let distY = Math.abs(currentTorch.y - selectedToken.y);
   let currentDistance = Math.max(distX, distY);

   //X,Y distance closest torch
   let distCloseX = Math.abs(closestTorch.x - selectedToken.x);
   let distCloseY = Math.abs(closestTorch.y - selectedToken.y);
   let closestDistance = Math.max(distCloseX, distCloseY);

   let minimum = Math.min(closestDistance, currentDistance);

   //match the resulting minimum distance to either the current or previous torch
   return minimum === closestDistance ? closestTorch : currentTorch;
}

let minimumTorch = droppedTorches.reduce(findClosestTorch, droppedTorches[0]);

//check that its within arm's reach
let gridSize = canvas.grid.size;
let torchDeltaX = Math.abs(selectedToken.x - minimumTorch.x);
let torchDeltaY = Math.abs(selectedToken.y - minimumTorch.y);
if (torchDeltaX <= gridSize && torchDeltaY <= gridSize){
   //torch within reach
   ui.notifications.info("You picked up a nearby torch.");
   
   //find the actual torch object on the canvas and delete it
   canvas.scene.deleteEmbeddedEntity('Token', minimumTorch._id);

   //sanitize vision numbers for max();
   let currentBright = isNaN(selectedToken.brightLight) ? 0 : selectedToken.brightLight;
   let currentDim = isNaN(selectedToken.dimLight) ? 0 : selectedToken.dimLight;

   //update the controlled token's vision (just bright/dim radius if its smaller, do not adjust "has sight")
   let newBright = Math.max(currentBright, 20);
   let newDim = Math.max(currentDim, 40);
   selectedToken.update({"brightLight": newBright,
                         "dimLight": newDim,
                         "lightColor": newBright === 20 ? "#ffa742" : "#ffffff"});
}
else{
  ui.notifications.error("Dropped torch not within reach (1 grid unit). Get closer.");
}

