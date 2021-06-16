/** taken from https://gitlab.com/crymic/foundry-vtt-macros/-/blob/master/5e/Classes/Barbarian/Rage.js
 *  Corrected a few syntax errors
 *  Removed mqol considerations
 *  Reworked for direct use in Item Macro (handles rolling the item as well)
*/

// This will auto adjust damage bonus on Rage.
let rage = async function() {
  let actorD = item.actor;
  let level = actorD.items.getName("Barbarian").data.data.levels;
  const existingEffect = actorD.effects.find(effect => effect.data.label == "Rage");
  if (existingEffect) {
    await existingEffect.delete();
    let the_message = `<em>${actorD.name}'s rage wears off.</em>`;
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({token: actorD}),
      content: the_message,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE
      });
  } else {
    const effectData = {
      label : "Rage",
      icon : item.img,
      changes: [{
        "key": "data.bonuses.mwak.damage",
        "mode": 2,
        "value": (Math.ceil(Math.floor(level/(9-(Math.floor(level/9)))+2))),
        "priority": 0
        },{
        "key": "data.traits.dr.value",
        "value": "slashing",
        "mode": 0,
        "priority": 0
        },{
        "key": "data.traits.dr.value",
        "value": "bludgeoning",
        "mode": 0,
        "priority": 0
        },{
        "key": "data.traits.dr.value",
        "value": "piercing",
        "mode": 0,
        "priority": 0
        }],
      duration : {rounds: 10},
    }
    await item.roll();
    await actorD.createEmbeddedDocuments("ActiveEffect", [effectData]);
    let the_message = `<em>${actorD.name} enters a rage!</em>`;
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({token: actorD}),
      content: the_message,
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE
    });
    
  }
};
rage();
