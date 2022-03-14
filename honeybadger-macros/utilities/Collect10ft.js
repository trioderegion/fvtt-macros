/* Returns any tokens within the defined radius (in grid units, e.g. feet).
 * Accounts for diagonal rules in use.
 * Requires: warpgate 1.13.5 or greater
 * Author: honeybadger#2614
 */
const aoeDistance = 10;

//generate the center points of every
//square this token occupies.
const occupiedSquares = token => {

    const topLeft = {x: token.x, y: token.y};
    const initialCenter = {x: topLeft.x + canvas.grid.size/2, y: topLeft.y + canvas.grid.size/2}
    const squareIndices = Array.from(Array(token.data.width * token.data.height).keys())

    const gridCenters = squareIndices.reduce( (acc, idx) => {
        const colIndex = idx % token.data.width;
        const rowIndex = Math.floor(idx/token.data.width);
        
        const center = {
            x: initialCenter.x + colIndex * canvas.grid.size,
            y: initialCenter.y + rowIndex * canvas.grid.size
        }

        acc.push(center);
        return acc; 
    },[]);

    return gridCenters;
}

//distance b/t 2 points accounting for grid rules
const calcDistance = (A, B) => {
    const ray = new Ray(A, B);
    const segments = [{ray}];
    const dist = canvas.grid.measureDistances(segments,{gridSpaces:true})[0]
    return dist;
}

//if any occupied center is within the radius
//we are contained
const isContained = (placeable, crosshairsData) => {
    if (token.id === placeable.id) return false;
    const centers = occupiedSquares(placeable);
    
    const contained = centers.find( pos => {
        const distance = calcDistance(pos, crosshairsData)
        return distance <= aoeDistance;
    }) ?? false;

    return contained;
}

//define the area we want to capture
const captureArea = {
    x: token.center.x,
    y: token.center.y, 
    scene: canvas.scene, 
    radius: aoeDistance/canvas.scene.data.gridDistance * canvas.grid.size
};

const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token', isContained)

console.log(containedTokens)
