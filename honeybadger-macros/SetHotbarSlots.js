/** note: if run by a player, the player needs permission to view this macro */

/** array of macro names exactly as they appear in the sidebar */
const macroNames = ["list","names","here"]

/** macronames is a list of strings, startingSlot is an integer
 *  slots start at 1 and increment linearly (i.e. bar 3 slot 4 = 34) */
async function AssignMacrosToSlots(macroNames, startingSlot) {
    
    for ( const name of macroNames ){
        let macroToSlot = game.macros.getName(name);
        if (macroToSlot){
            /** @todo, can change to push these to players by grabbing a specfific user from game.users */
            await game.user.assignHotbarMacro(macroToSlot, startingSlot.toString());
        } else {
         console.error(`Could not find macro ${name} in the world to assign to hotbar slot ${startingSlot}`)  
        }
        
        startingSlot++;
    }
}

AssignMacrosToSlots(macroNames, 1);
