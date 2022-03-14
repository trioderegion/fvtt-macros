/* Pull Target 10 ft.
 * MIT License (C) 2022 Matthew Haentschke
 * Requirements: Warpgate, Sequencer, JB2A Patreon Pack
 * Usage: Chat message creation serves as standins for system
 *        specific rolling and damage implementations.
 *        Must have source token selected. Optionally may have
 *        target token targeted, otherwise, crosshairs will be 
 *        used to select target token.
 *        Extra steps are executed if the target ends within
 *        10 feet of the caster (think Lightning Lure).
 * Note: There is an assumption that 1 grid space = 5 ft.
 *       Change `pixel5Ft` accordingly.
 */

async function getThem() {
    let them = game.user.targets.values().next().value;
    if (!them) {
        ui.notifications.info('No target selected, please indicate target.')
        const location = await warpgate.crosshairs.show({
            drawIcon: false,
            interval: 0,
            lockSize: false,
            size: 1.5,
            rememberControlled: true,
            fillColor: "#FF0000",
            fillAlpha: 0.3
        });

        if ( location.cancelled ) return;

        /* if we have some selected create a list of IDs to filter OUT of the collected tokens.
        * We refuse to have a token follow itself
        */
        const selectedIds = canvas.tokens.controlled.map( t => t.id );

        const tokens = warpgate.crosshairs.collect(location).filter( token => !selectedIds.includes(token.id) );

        tokens.sort( (a, b,) => {
        /* compute distance */
        const distanceA = new Ray(followerToken.object.center, a.object.center).distance;
        const distanceB = new Ray(followerToken.object.center, b.object.center).distance;

        return distanceA < distanceB ? -1 : distanceA > distanceB ? 1 : 0;
        });

        them = tokens[0]?.object;
    }

    return them;
}

//Standin For Item Roll
await ChatMessage.create({
            speaker: {alias: 'Announcer'},
            content: `[Stand-in for Item Card]`
        })

const me = canvas.tokens.get(token.id);
let them = await getThem();

if(!them) {
    ui.notifications.error('No valid targets found.');
    return;
}

const chainId = randomID();

const chain = new Sequence()
    .effect()
        .stretchTo(them, {attachTo: true})
        .attachTo(me)
        .file("jb2a.energy_beam.reverse.blue")
        .persist()
        .fadeIn(500)
        .fadeOut(1000)
        .origin(chainId)

await chain.play()

const tokenCenter = them.center;
let cachedDistance = 0;
let cachedPosition = {x: 0, y: 0}

//canvas.grid.measureDistances([{ray: new Ray( tokenCenter, me.center )}], {gridSpaces:true})[0]

const validSpace = me.bounds.enlarge(them.bounds);

const checkDistance = async(crosshairs) => {
    cachedPosition.x = crosshairs.x;
    cachedPosition.y = crosshairs.y;
    
    while (crosshairs.inFlight) {
        
        //wait for initial render
        await warpgate.wait(100);

        //only update if the position has changed
        if ((cachedPosition.x !== crosshairs.x) || (cachedPosition.y !== crosshairs.y)) {
          
          cachedPosition.x = crosshairs.x;
          cachedPosition.y = crosshairs.y;

          const ray = new Ray( tokenCenter, crosshairs );
          cachedDistance = canvas.grid.measureDistances([{ray}], {gridSpaces:true})[0]; 
          console.log(validSpace, crosshairs.x, crosshairs.y)    
          if(cachedDistance > 10 || !validSpace.contains(crosshairs.x, crosshairs.y)) {
              crosshairs.icon = 'icons/svg/hazard.svg'
          } else {
              crosshairs.icon = them.data.img
          }

          crosshairs.draw()
        
          crosshairs.label = `${cachedDistance} ft`
          
        }
        
    }
    
}

const showCallbacks = {
    show: checkDistance
}

const location = await warpgate.crosshairs.show({size: them.data.width, icon: them.data.img, label: '0 ft.', rememberControlled: true,}, showCallbacks)

console.log(location)

if (location.cancelled) return;

if (cachedDistance > 10) {
    ui.notifications.error('Can pull a maximum of 10ft in a straight line.')
    return;
}
const {x,y} = canvas.grid.getSnappedPosition(location.x - them.width/them.data.scale/2-10, location.y - them.height/them.data.scale/2-10);
const updates = {token: {x,y}}

const pixel5Feet = canvas.grid.size;

const within5ft = async (tokenDoc) => {
    await CanvasAnimation.getAnimation(tokenDoc.object.movementAnimationName)?.promise
    const ourRange = me.bounds.pad(pixel5Feet/2,pixel5Feet/2);
    const theirRange = tokenDoc.object.bounds;
    const within = ourRange.intersects(theirRange);
    if (within) {
        await ChatMessage.create({
            speaker: {alias: 'Announcer'},
            content: `The target is now within 5 feet of ${me.name}`
        })

        const burstId = randomID();
        const burst = new Sequence()
            .effect()
            .stretchTo(them)
            .attachTo(me)
            .file("jb2a.chain_lightning.primary.blue")
            .origin(burstId)
            .play()

        //Standin For Item Damage Roll
        await new Roll('1d8').toMessage({flavor: '[Displayed Damage Card]'});
    }

    await Sequencer.EffectManager.endEffects({origin: chainId})



    return;
}

const mutateCallbacks = {
    post: within5ft
}

await warpgate.mutate(them.document, updates, mutateCallbacks, {permanent: true, description: `Pulling ${cachedDistance} ft.`} )