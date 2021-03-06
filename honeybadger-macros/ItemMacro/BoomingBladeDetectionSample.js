/**emulating item macro*/
let item = token.actor.items.getName("Booming Blade");
item.options = {actor: token.actor};

/** ok, lets see how far implicit JS captures can be stretched */
let on = false;
const targetId = duplicate(Array.from(game.user.targets)[0].id);
let hookId;
function BoomingHook(scene, token, update) {
      
    /** this is the token we want? */
    if(token._id == targetId && (!!update.x || !!update.y)){
        item.rollDamage({versatile:true})
        ui.notifications.info("Boom!")
        on = false;
    } else {
        hookId = Hooks.once("updateToken", BoomingHook);
    }
}

if (on == false){
    /** register the hook*/
    ui.notifications.info("I cast booming blade!")
    hookId = Hooks.once("updateToken", BoomingHook);
    on = true;
}