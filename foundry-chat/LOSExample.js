/** from tdhsmith#8148 -- example code for computing if a point is within line of sight of another point */

// setup
let origin = {x: explosion.x, y: explosion.y};
let {rays, los, fov} = SightLayer.computeSight(origin, distance);
let explosionShape = fov;
// checks are then like:
if (explosionShape.contains(tokenX, tokenY)) { /* etc */ }