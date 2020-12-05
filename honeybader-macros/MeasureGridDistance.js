/** measures distance between the two selected tokens, accounting for diagonal rules */

const ray = new Ray(canvas.tokens.controlled[0], canvas.tokens.controlled[1]);
const segments = [{ray}];
let dist = canvas.grid.measureDistances(segments,{gridSpaces:true})[0]
    
ui.notifications.info(`${dist} ft apart`)