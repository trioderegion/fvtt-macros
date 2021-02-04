//test bed values
const x1 = 1951;
const y1 = 1951;
const x2 = 1960;
const y2 = 1846;
const x3 = 1855;
const y3 = 1951;
const x4 = 2051;
const y4 = 2051;
const x5 = 2060;
const y5 = 2146;
const x6 = 2155;
const y6 = 2051;

//input is a list of x/y points that will be connected cyclically (end to begin)
const cycleList = [
     {x: x1, y: y1},
     {x: x2, y: y2},
     {x: x3, y: y3},
     {x: x4, y: y4},
     {x: x5, y: y5},
     {x: x6, y: y6}
    ];
    
// ====ACTUAL FUNCTION====

/** xyPairList = [ {x:Num, y:Num}, ... ] */
/* config = {move: 1, sense: 2, door: 0} (example) */
async function createWallCycle(xyPairList, config = null)
{
    if (xyPairList.length < 2){
        return;
    }
    //note: this should be the default value of config in the prototype, but it forget how in JS
    config = config == null ? {move: 1, sense: 2, door: 0} : config;
    
    let rotated = xyPairList.slice(1);
    rotated.push(xyPairList[0]);
    
    const newWallData = xyPairList.map( (point, index) => {
        return {
            c:[point.x, point.y, rotated[index].x, rotated[index].y],
            move: config.move,
            sense: config.sense,
            door: config.door
        }
    })
    
    return Wall.create(newWallData)
}
// =========================

createWallCycle(cycleList);