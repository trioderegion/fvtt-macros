honeybadger
#2614

Gazkhan - Jules — 12/11/2021
- This channel is for posting macros only. Use Threads or macros to discuss about it.
- Make sure the macro works ! 
- Modules and Systems needed must be specified Use the thread, if more instructions are needed.
- Provide a video showing the macro in action links for software provided below.
- Do not share code you did not write or if allowed, credit the author and mention the license when relevant.

https://www.screentogif.com/
https://github.com/michaelmob/WebMCam 
Gazkhan - Jules — 12/11/2021
DnD5e - Rage feature bonuses with Active Effect
Modules required :
Warp Gate,
Item Macro, 
Sequencer,
JB2A
/** DnD5e Rage feature bonuses, Active Effect and animation using Warp Gate, Item Macro, Sequencer and JB2A **/

/**************************************************************************
MIT License Copyright (c) 2021 Jules | JB2A 
Full license text found here: https://opensource.org/licenses/MIT
****************************************************************************/
Expand
AnimatedRageEffect.js
5 KB
Thread
DnD5e - Rage feature bonuses with Active Effect
14 Messages ›
There are no recent messages in this thread.
Naudran — 12/15/2021
Macro for Snilloc's Snowball Swarm
Modules required:
- JB2A
- Sequencer
- not needed for it to work: Midi QOL for auto template targeting 
const caster = canvas.tokens.controlled[0];
const targets = Array.from(game.user.targets);
const snowballMax = 5;
const attackMax = targets?.length;

for (let snowballCount = 0; snowballCount < snowballMax; snowballCount++) {
Expand
SnowballSwarm.js
1 KB
Image
Thread
Macro for Snillocs Snowball Swarm
10 Messages ›
There are no recent messages in this thread.
david (aka claudekennilol) — 12/15/2021
Burning Hands (15' cone)
Modules required : 
-Warpgate
-Sequencer
-JB2A, patreon

Almost the entirety of this macro is for getting the cones placed appropriately. It works on the selected token, or if you don't have a token selected then you pick a grid square to start from and then you pick the direction off of that. The part at the end that plays the animation can super easily be swapped out for any other cone spell. (you can also change the rules for which squares should be highlighted may be off depending on which rules system you're using) 

The macro is in this github repo as it's easier to keep updated than dropping the file here (as far as I know files attached to posts in discord can't be edited)
https://github.com/dmrickey/ckl-foundry-macros/blob/master/spell-animations/burning-hands.js

Link to newer clip of it https://youtu.be/snVJzI37FTE 
Thread
Burning Hands macro
12 Messages ›
There are no recent messages in this thread.
callbritton — 12/16/2021
This is my Path of the Beast macro: When a PoB Barbarian rages, it creates the usual active effects, but also asks if what weapon they want to manifest. Requires midi-qol and warpgate (obv), as well as items already set up in-game with the names of the PoB Weapons. Thanks very much to @honeybadger and @Gazkhan - Jules for the inspiration!
let actorD = item.actor;
let level = actorD.items.getName("Barbarian").data.data.levels;
let subClass = actorD.items.getName("Barbarian").data.data.subclass;

// function condition(eventData) {
//   console.log(token.id, eventData.actorData.token);
Expand
rage_beast.js
4 KB
Thread
Path of the Beast macro
50+ Messages ›
There are no recent messages in this thread.
callbritton — 12/16/2021
and here's the github if anyone is interested. Includes json files for weapons: https://github.com/ctbritt/path-of-the-beast-foundryvtt
GitHub
GitHub - ctbritt/path-of-the-beast-foundryvtt: A Macro to spawn pro...
A Macro to spawn proper Path of the Beast weapons for a barbarian when they rage - GitHub - ctbritt/path-of-the-beast-foundryvtt: A Macro to spawn proper Path of the Beast weapons for a barbarian w...
GitHub - ctbritt/path-of-the-beast-foundryvtt: A Macro to spawn pro...
honeybadger — 12/28/2021
System Agnostic* Trading
Requires: Warp Gate v1.11.0+
Features: Item trading and currency trading* between tokens.

*Disclaimer: currency trading only compatible with DnD5e.

Video attached is from an early concept version lacking most of the QoL features of this full version (currency, quantity, item filtering)
/* Requires Warp Gate v1.11.0 or greater */

/* Will initiate a trade _from_ the selected token
 * _to_ the targeted token. Owned items are filtered
 * by what I expect to be actual equipment (i.e. not
 * class, spells, features). Recipient will receive
Expand
WGTrade.js
7 KB
Thread
Trading Macro
1 Message ›
There are no recent messages in this thread.
Nargath — 12/30/2021
"Create Bonfire" Spell Macro for DnD 5e
Modules Required:
Warp Gate
MIDI QOL
Item Macro
Sequencer
JB2A Patreon

Description: This macro will pull in a pre-created actor from the sidebar called "Bonfire" (the actor is included as well), and will dispel it when concentration is broken.

Usage: Import the "fvtt-Item-Create-Bonfire.json" file as a Spell Item in the Sidebar, then drag it to your character's Spellbook. Also import the "fvtt-Actor-bonfire.json" as an Actor on the sidebar.
The macro is stored in the spell itself in the ItemMacro section. The spell then calls it using MIDI's OnUse field.

Limitations: There's no automation around the Bonfire damaging creatures when they're standing on the bonfire itself, but the 'Bonfire' actor does have an attack pre-built, so that you can run the damage yourself. There's also no cantrip spell scaling, so higher level characters, you'll need to adjust it manually. 

Attribution: Most of this is cobbled together from a variety of places, including the Flaming Sphere spell in the MIDI Sample Items compendium, as well as the various examples on the Warpgate Wiki page 
Image
{
  "name": "Create Bonfire",
  "type": "spell",
  "img": "systems/dnd5e/icons/skills/red_30.jpg",
  "data": {
    "description": {
Expand
fvtt-Item-create-bonfire.json
8 KB
{
  "name": "Bonfire",
  "type": "npc",
  "img": "modules/jb2a_patreon/Library/Generic/Fire/Campfire/Campfire_02_Regular_Orange_Thumb.webp",
  "data": {
    "abilities": {
Expand
fvtt-Actor-bonfire.json
12 KB
Thread
Create Bonfire Spell Macro for DnD5e
10 Messages ›
There are no recent messages in this thread.
callbritton — 01/12/2022
"Vitriolic Sphere" Spell Macro for DnD5e
Modules required: 
Sequencer 2.0
Midi-QOL
ItemMacro
JB2A Patreon
Jinker's Animated Art Pack

Description: Will cast vitriolic sphere and take care of 2nd round damage.

Limitations: Will need to delete the template manually at the end of the second round. The effect is attached to the template, so it will disappear too.

Attribution: Much help from @Otigon and @Wasp 
callbritton — 01/12/2022
const tactor = canvas.tokens.get(args[0].tokenId);
const templateObject = canvas.templates.placeables[canvas.templates.placeables.length - 1]
new Sequence()
  .effect()
    .file("jb2a.fire_bolt.green02")
    .atLocation(tactor)
    .stretchTo({ x: templateObject.data.x, y: templateObject.data.y })
    .waitUntilFinished(-500)
  .effect()
    .file("modules/jaamod/AnimatedArt/Spells-Effects/cloudKill.webm")
    .attachTo(templateObject)
    .scaleToObject(1.3)
    .opacity(0.5)
    .persist()
    .scaleIn(0.1, 200, {ease: "easeOutQuint", delay: 100})
    .fadeOut(1000, {ease: "easeInQuad"})
  .play()
 
Thread
Vitriolic Sphere
19 Messages ›
There are no recent messages in this thread.
Phil
 started a thread: 
Minute Meteors
. See all 
threads
.
 — 01/18/2022
Thread
Minute Meteors
11 Messages ›
There are no recent messages in this thread.
callbritton — 01/20/2022
Maximilian's Earthen Grasp: 
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const summonType = "Maximilian's Hand";
const summonerDc = actorD.data.data.attributes.spelldc;
console.log("actorD = " + actorD);
console.log("tokenD = " + tokenD);
console.log("summonType = " + summonType);
console.log("summonerDc = " + summonerDc);

let updates = {
    token: {
        'alpha': 0,
        'name': `${summonType} of ${actorD.name}`

    },
    actor: {
        'name': `${summonType} of ${actorD.name}`,
    },
    embedded: {
        Item: {
            "Reach": {
                'data.save.dc': summonerDc,
                'data.save.scaling': "flat"
            },
            "Crush": {
                'data.save.dc': summonerDc,
                'data.save.scaling': "flat"
            },
        },
    },
};

async function myEffectFunction(template, update) {
    //prep summoning area

    new Sequence()
        .effect()
        .file("jb2a.impact.ground_crack.03.orange")
        .atLocation(template)
        .center()
        .scale(1)
        .belowTokens()
        .play();
}

async function postEffects(template, token) {
    //bring in our minion
    new Sequence()
        .animation()
        .on(token)
        .fadeIn(500)
        .play();
}

const callbacks = {
    pre: async (template, update) => {
        myEffectFunction(template, update);
        await warpgate.wait(500);
    },
    post: async (template, token) => {
        postEffects(template, token);
        await warpgate.wait(500);
    },
};

const options = { controllingActor: actor };

warpgate.spawn(summonType, updates, callbacks, options);
Thread
Maxs Earthen Grasp
3 Messages ›
There are no recent messages in this thread.
winterwulf — 02/02/2022
Wildshape | D&D5e | Midi QOL, DAE, Advanced Macros and Sequencer 
Thread
Wildshape | D&D5e | Midi QOL, DAE, Advanced Macros and Sequencer
50+ Messages ›
There are no recent messages in this thread.
callbritton — 02/02/2022
Mass Convert Dead NPCs to Item Piles with a treasure glow | Sequencer | Item Piles | DnD5e: 
let corpses = canvas.tokens.placeables.filter(function (target) {
  return (
    target?.actor?.data?.data?.attributes?.hp?.value <= 0 &&
    target?.actor?.data?.type == "npc" // adjust paths for your particular system
  );
});

ItemPiles.API.turnTokensIntoItemPiles(corpses);

for (let i of corpses) {
  new Sequence()
    .effect()
    .file("jb2a.token_border.circle.spinning.orange.001")
    .attachTo(i)
    .scale(0.5)
    .persist()
    .fadeIn(300)
    .fadeOut(300)
    .name(`Treasure Glow-${i.data.name}`)
    .play()
}
 
Thread
Mass Convert Dead NPCs to Item Piles with a treasure glow
50+ Messages ›
There are no recent messages in this thread.
MrVauxs — 02/09/2022
Electric Arc | Sequencer
A simple macro for the PF2e cantrip Electric Arc, slap it into A-A and you have your Spell Special Effects done 
const targets = Array.from(game.user.targets);
// if no source and no target then don't try to play anything
if (!token || !targets.length) return;

if (targets.length === 1) {
    new Sequence()
        .effect()
            .file("jb2a.electric_arc")
            .atLocation(token)
            .stretchTo(targets[0])
            .randomOffset(0.5)
        .play();
}
else {
    const seq = new Sequence()
        .effect()
            .file("jb2a.electric_arc")
            .atLocation(token)
            .stretchTo(targets[0])
    for (let i = 1; i < targets.length; i++) {
        const from = targets[i-1];
        const to = targets[i];
        seq.effect()
            .file("jb2a.electric_arc")
            .atLocation(from)
            .stretchTo(to)
            .randomOffset(0.5)
    }
    seq.play()
}

https://imgur.com/a/yUx6JN2
Thread
Electric Arc
2 Messages ›
There are no recent messages in this thread.
Dawid Izydor — 02/18/2022
Hello, I've created a loading screen for my players, could use some help with making it a bit more seemless, currently running it as a world script for each player to show up their tokens + GM hides them when they're disconnected, theres a magic sign when each player logs in and then a conjuration sign on the table when everyone is loaded up, map is one of the latest from Morvold Press, link to yt as the file was too big to upload here https://www.youtube.com/watch?v=_9aEIqGuGBE
Hooks.on("ready", () => showActiveTokens());

const wait = async (ms) => new Promise((resolve)=> setTimeout(resolve, ms));
const persistReadyCircleName = "PersistReadyCircle";
async function hideAll(){
	var hideAll = game.scenes.active.tokens.map(td=>({_id: td.id, hidden: true}));
Expand
welcomescreen.js
4 KB
YouTube
Dawid Izydor
Foundry vtt waiting for players screen-

Thread
Player login table
9 Messages ›
There are no recent messages in this thread.
david (aka claudekennilol)
 started a thread: 
Player login table
. See all 
threads
.
 — 02/18/2022
callbritton — 02/18/2022
As per @Tatonker's request, here's my fully automated Tekeli-Li for Rime of the Frostmaiden. This is a legendary gnoll vampire, so if you're not boosting its levels, you'll want to modify some of the other abilities accordingly. Import first and modify after. 

Notes for this  json: 
1) fully automated vampire bites in that they will do damage, heal Tekeli-li, and lower PC's max HP
2) Fully automated regeneration thanks to midi-qol regeneration item
3) fully automated shapechanger feat, that uses Warpgate to mutate between heyena and mist forms. (there are no fancy visual effects on the shapechange. I'd like to add some. If someone wants to take a crack at that, the item macro on Shapechanger has the code to dig into. )
4) you will want to set your own token images and portraits, since the paths are to files on my install.
5) Legendary resistance is currently at 1/3 because of two earlier saving throws (they've encountered him on the same day.) Manually change if your players are hitting him fresh. 

Modules required: DAE | Midi-QOL | Warpgate | Sequencer (if you get fancy) | ItemMacro | (probably) Advanced Macros

PS: If you use the legendary version, considering using D&D 5e Helpers, as it helps hugely with the legendary actions at the start of turns. (You can turn off regeneration, however, since the midi version of regeneration will handle that automatically. 
{
  "name": "Tekeli-li",
  "type": "npc",
  "img": "s3/images/npc/tekeli_li.Avatar.webp?1645139242185",
  "data": {
    "abilities": {... (29 KB left)
Expand
fvtt-Actor-tekeli-li.json
79 KB
Elwin — 02/19/2022
I developed two macros to delete tiles or persistent sequencer effects created by AA when the Feature/Spell expires. 
Elwin — 02/19/2022
// ##################################################################################################
// Read First!!!!
// Delete Automated Animation Persistent Tile on Feature/Spell expiration.
// v0.1.0
// Dependencies:
//  - Automated Animation
Expand
deleteAATileOnExpiration.js
3 KB
// ##################################################################################################
// Read First!!!!
// Delete Automated Animation Persistent Sequencer Effect on Feature/Spell expiration.
// v0.1.0
// Dependencies:
//  - Automated Animation
Expand
deleteAASeqEffectOnExpiration.js
3 KB
Thread
DnD5e | Tile or persistent Sequencer effect automatic deletion.
7 Messages ›
There are no recent messages in this thread.
Wasp — 03/09/2022
Curse of Strahd: Vestige Whispers
Has one of your players died and accepted the dark powers' bargain to come back? Do you want to lead them astray? Slowly corrupt their understanding of the world? This macro is for you then!

Only requires Sequencer and the free JB2A module. If you want custom fonts, I recommend Custom Fonts by arcanist. 
const texts = {
    "lies": [
        "LIES",
        "HALFTRUTHS",
        "UNTRUSTWORTHY",
        "VENOMOUS WORDS",
Expand
whispers.js
5 KB
Thread
Curse of Strahd Whispers
2 Messages ›
There are no recent messages in this thread.
Wasp — 03/11/2022
Chaos Bolt

While ASE will have Chaos Bolt in the near future, this will work with MidiQOL, Advanced Macros, Warpgate, Sequencer, and JB2A 
// Chaos Bolt Nacro by Wasp
// Remove all attacks and damage rolls from the item
// Dependants: MidiQOL, Advanced Macros, Warpgate, Dice So Nice (not required, but supported), Sequencer & JB2A (not required, but supported)

class ChaosBoltWorkflow {

Expand
Chaos-Bolt.js
13 KB
Thread
Chaos Bolt Discussion
3 Messages ›
There are no recent messages in this thread.
honeybadger — Yesterday at 11:32 PM
Pull 10 Feet (Template Code)
A system agnostic macro that can serve as the base for utilizing with your system or rolling method of choice. Extra steps are executed if the target ends within 10 feet of the caster (think Lightning Lure). Handles oddly sized tokens without issue.
/* Pull Target 10 ft.
 * MIT License (C) 2022 Matthew Haentschke
 * Requirements: Warpgate, Sequencer, JB2A Patreon Pack
 * Usage: Chat message creation serves as standins for system
 *        specific rolling and damage implementations.
 *        Must have source token selected. Optionally may have
Expand
Pull10ft.js
6 KB
Thread
Pull 10 Feet Discussion
2 Messages ›
honeybadger
45m ago
﻿
honeybadger — Yesterday at 11:32 PM
Pull 10 Feet (Template Code)
A system agnostic macro that can serve as the base for utilizing with your system or rolling method of choice. Extra steps are executed if the target ends within 10 feet of the caster (think Lightning Lure). Handles oddly sized tokens without issue.
/* Pull Target 10 ft.
 * MIT License (C) 2022 Matthew Haentschke
 * Requirements: Warpgate, Sequencer, JB2A Patreon Pack
 * Usage: Chat message creation serves as standins for system
 *        specific rolling and damage implementations.
 *        Must have source token selected. Optionally may have
Expand
Pull10ft.js
6 KB
honeybadger — Yesterday at 11:35 PM
Im about to never do a distance check again and just use bounding boxes forever 😝
@Nirurin @Crymic OP Delivers!
﻿
/* Requires Warp Gate v1.11.0 or greater */

/* Will initiate a trade _from_ the selected token
 * _to_ the targeted token. Owned items are filtered
 * by what I expect to be actual equipment (i.e. not
 * class, spells, features). Recipient will receive
 * a popup to accept or reject the trade. The sender's
 * inventory will only be updated if the recipient
 * accepts. Note: if both tokens are owned by the user,
 * no confirmation dialog will appear and item will be
 * immediately transferred.
 */

function collectItems(actor) {
  let items = actor.items.filter(item => item.type !== 'spell' && item.type !=='class' && item.type !== 'feat')
  items.sort( (a,b) => {
    if(a<b) return -1;
    if(a>b) return 1;
    return 0;
  } )
  return items;
}

function sendItemUpdate(item, quantity) {

  let embedded = {
    Item: {
      [item.name]: {}
    }
  }

  //decrement if more than 1
  if(item.data.data.quantity > quantity) {
    embedded.Item[item.name] = {
      'data.quantity': item.data.data.quantity - quantity
    }
  } else {
    //delete if not
    embedded.Item[item.name] = warpgate.CONST.DELETE;
  }

  return embedded;
}

function receiveItemUpdate(item, quantity, to) {
  let embedded = {
    Item: {
      [item.name]: {}
    }
  }

  let createData = item.toObject();

  //determine quantity
  const currentCount = to.actor.items.getName(item.name)?.data.data.quantity ?? 0;

  createData.data.quantity = currentCount + quantity;

  delete createData._id;

  embedded.Item[item.name] = createData;

  return embedded;
}

async function giveItemDialog(token) {
  const actor = token.actor;
  const items = collectItems(actor);

  const labelToData = new Map();
  items.forEach( (item) => {
    const quantity = item.data.data.quantity ?? 1;
    const label = `${item.name} (${quantity})`
    labelToData.set(label, {item, quantity})
  });

  let validResponse = false;
  let choice, quantity;

  while(!validResponse) {
    [choice,quantity] = await warpgate.dialog([{label: 'Which Item?', type: 'select', options: Array.from(labelToData.keys())},
                                            {label: 'How Many?', type: 'number', options: 1}], 'Select item and quantity to send')
    if (quantity > labelToData.get(choice).quantity || quantity < 1){
      ui.notifications.warn(`Quantity of ${quantity} is invalid for ${choice}.`)
    } else {
      validResponse = true;
    }
  }

  const result = labelToData.get(choice);
  return result;
}

function validCurrency(current, toSend) {

  const inRange = Object.keys(current).reduce( (acc, key) => {
    const valid = Math.clamped(toSend[key], 0, current[key]) === toSend[key];
    return acc && valid;
  }, true)

  /* strip out zeroes */
  const result = Object.entries(current).reduce( (acc, [key, value]) => {
    
    if (toSend[key] > 0) {
      acc[key] = toSend[key];
    }

    return acc;
  },{})

  return {valid: inRange, currency: result}
}

const toName = {
  pp: 'Platinum',
  gp: 'Gold',
  ep: 'Electrum',
  sp: 'Silver',
  cp: 'Copper'
}

async function giveCurrencyDialog(token) {
  const actor = token.actor;
  const currency = actor.data.data.currency;

  const labelToData = new Map();
  Object.entries(currency).forEach( ([denom, value]) => {
    const label = `${toName[denom]} (${value})`
    labelToData.set(label, {denom, value})
  })

  const dialogData = Array.from(labelToData.keys()).map( (key) => {
    return {type:'number', label: key, options: 0}
  })

  let valid = false
  let choices = {};
  while (!valid) {
    const [pp, gp, ep, sp, cp] = await warpgate.dialog(dialogData, 'Enter amount to send')
    choices = {pp, gp, ep, sp, cp}
    
    result = validCurrency(currency, choices);
    choices = result.currency;
    valid = result.valid;
  }

  return choices;
}

function sendCurrencyUpdate(actor, toSend) {
  const current = actor.data.data.currency;
  const newCurrency = Object.entries(toSend).reduce( (acc, [key, value]) => {
    acc[key] = current[key] - value;
    return acc;
  }, {})
  const update = { 'data.currency': newCurrency}
  return update;
}

function receiveCurrencyUpdate(actor, toSend) {
  const current = actor.data.data.currency;
  const newCurrency = Object.entries(toSend).reduce( (acc, [key, value]) => {
    acc[key] = current[key] + value;
    return acc;
  }, {})
  const update = { 'data.currency': newCurrency}
  return update;
}

async function trade(toToken, fromToken = canvas.tokens.controlled[0] ?? game.user.character.getActiveTokens()[0]) {

  if(toToken.id == fromToken.id){
    ui.notifications.warn('You cannot trade with yourself!')
    return
  }

  const tradeType = await warpgate.buttonDialog({buttons: [{
    label: 'Items',
    value: 'item'
  },{
    label: 'Currency',
    value: 'currency'
  }], title: 'What do you want to send?'});

  if(tradeType === 'item') {

    const {item, quantity} = await giveItemDialog(fromToken);
    console.log(item)

    const sendUpdate = {
      embedded: sendItemUpdate(item, quantity)
    };

    const receiveUpdate = {
      embedded: receiveItemUpdate(item, quantity, toToken)
    }

    const callbacks = {
      post: async () => {
        ui.notifications.info(`Gave ${quantity} ${item.name} to ${toToken.name}`);
        await warpgate.mutate(fromToken.document, sendUpdate, {}, {permanent: true})
      }
    }

    await warpgate.mutate(toToken.document,
                          receiveUpdate, 
                          callbacks,
                          {permanent: true, name: `Give ${item.name}`, description: `Receiving a(n) ${item.name}`})

  } else if(tradeType === 'currency') {
    const toSend = await giveCurrencyDialog(fromToken);
    console.log(toSend)

    const sendUpdate = {
      actor: sendCurrencyUpdate(fromToken.actor, toSend)
    }

    const receiveUpdate = {
      actor: receiveCurrencyUpdate(toToken.actor, toSend)
    }

    let currencyString = Object.entries(toSend).reduce( (acc, [key, value]) => {
      acc += `${value} ${toName[key]}, `
      return acc;
    },'')

    currencyString = currencyString.slice(0, -2)

    console.log(sendUpdate, receiveUpdate, currencyString);

    /* capture accept response and adjust our currency */
    const callbacks = {
      post: async () => {
        ui.notifications.info(`Gave ${currencyString} to ${toToken.name}`);
        await warpgate.mutate(fromToken.document, sendUpdate, {}, {permanent: true})
      }
    }

    await warpgate.mutate(toToken.document,
                      receiveUpdate, 
                      callbacks,
                      {permanent: true, name: `Give currency`, description: `Receiving ${currencyString}`})
  }
}

trade(Array.from(game.user.targets)[0]);
WGTrade.js
7 KB
