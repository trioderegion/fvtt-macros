/* Requires Warp Gate and Item Macro */
// Misty Step Item Macro
token.actor.sheet.minimize();
const tokenCenter = token.center;
let cachedDistance = 0;
const checkDistance = async(crosshairs) => {

    while (crosshairs.inFlight) {
        
        //wait for initial render
        await warpgate.wait(100);
        
        const ray = new Ray( tokenCenter, crosshairs );
        
        const distance = canvas.grid.measureDistances([{ray}], {gridSpaces:true})[0]

        //only update if the distance has changed
        if (cachedDistance !== distance) {
          cachedDistance = distance;     
          if(distance > 30) {
              crosshairs.icon = 'icons/svg/hazard.svg'
          } else {
              crosshairs.icon = token.data.img
          }

          crosshairs.draw()
        
          crosshairs.label = `${distance} ft`
          
        }
        
    }
    
}

const callbacks = {
    show: checkDistance
}

const location = await warpgate.crosshairs.show({size: token.data.width, icon: token.data.img, label: '0 ft.'}, callbacks)

console.log(location)

if (location.cancelled) return;
if (cachedDistance > 30) {
    ui.notifications.error('Misty Step has a maximum range of 30 ft.')
    return;
}
const {x,y} = canvas.grid.getSnappedPosition(location.x-10, location.y-10);
const updates = {token: {x,y}}
await item.roll();
await warpgate.mutate(token.document, updates, {}, {permanent: true} )
token.actor.sheet.maximize();
