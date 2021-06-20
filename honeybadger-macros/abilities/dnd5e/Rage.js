/** Original Author: Crymic (https://gitlab.com/crymic/foundry-vtt-macros/-/blob/master/5e/Classes/Barbarian/Rage.js)
 *  Corrected a few syntax errors
 *  Removed mqol considerations
 *  Reworked for direct use in Item Macro (handles rolling the item as well)
 *  Upgraded to 0.8.x
*/

/**************************************************************************
MIT License
Copyright (c) 2021 Matthew Haentschke
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
****************************************************************************/

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
