async function DrawDebugRays(drawingList){
    await canvas.drawings.createMany(drawingList);
}
     
 
if (canvas.tokens.controlled.length == 2) {
   
    const myToken = canvas.tokens.controlled[0];
    const theirToken = canvas.tokens.controlled[1];
    
    /** create the offset coordinates for MY size token */
    /** @todo scale for larger than medium */
    let mediumOffsets = [ [0,0], [canvas.grid.size,0], [0,canvas.grid.size], [canvas.grid.size, canvas.grid.size] ];
    
    /** create 4 new source points to test from */
    let myTestPoints = mediumOffsets.map( offset => { return [offset[0]+myToken.x, offset[1]+myToken.y]});
    let theirTestPoints = mediumOffsets.map( offset => { return [offset[0]+theirToken.x, offset[1]+theirToken.y]});
    
    /** create pairs of points representing the test structure as source point to target array of points */
    let sightLines = myTestPoints.map( sourcePoint =>  {
        return {
            source:sourcePoint,
            targets : theirTestPoints
        }})
    
    /** Debug visualization */
    if (event.ctrlKey) {
        let debugSightLines = [];
        sightLines.forEach( sourceAndTargets => {
            sourceAndTargets.targets.forEach( target => {
                debugSightLines.push([sourceAndTargets.source, target])
            })
        })
        
        const myCornerDebugRays = debugSightLines.map( ray => {
            return {
                type: CONST.DRAWING_TYPES.POLYGON,
                author: game.user._id,
                x: 0,
                y: 0,
                strokeWidth: 2,
                strokeColor: "#FF0000",
                strokeAlpha: 0.75,
                textColor: "#00FF00",
                points: [ray[0],ray[1]]
            }
        });
        
    
        
        DrawDebugRays(myCornerDebugRays);
    }
    /** \Debug visualization */
    
    /** @todo actual collision */
    let hitResults = sightLines.map( corner => {
        
        let results = corner.targets.map( target => {
                const ray = new Ray( {x: corner.source[0], y:corner.source[1]}, {x: target[0] , y:target[1]} );
                const options = {
                    blockMovement :false,
                    blockSenses: true,
                    mode:'any'
                } 
                return WallsLayer.getRayCollisions(ray,options);
        })
        
        return { source: corner.source, targetBlocked: results }
    
    })
    
    /** now find the maximum number of "false" hit detects across all source corners */
    let accumulator = {corner: [0,0], unblocked:0}
    function MostVisible(accumulator, currentValue) {
        const freeLines = currentValue.targetBlocked.filter( blocked => blocked == false).length
        if (freeLines > accumulator.unblocked){
            return {corner: currentValue.source, unblocked:freeLines};
        } else {
            return accumulator;
        }
    }
    
    let bestCorner = hitResults.reduce(MostVisible, accumulator)
    
    switch(bestCorner.unblocked){
        case 0 : ui.notifications.info("Total Cover"); break;
        case 1 : ui.notifications.info("Three-quarters cover"); break;
        case 2 : ui.notifications.info("half cover"); break;
        case 3:  ui.notifications.info("half cover"); break;
        case 4: ui.notifications.info("No cover"); break;
        default: ui.notifications.warn(" MY EYES!! NOOOO. "); break;
    }
    
    console.log(hitResults)
    console.log(bestCorner)
} else {  ui.notifications.warn("Please select two and only two tokens for cover checks"); }