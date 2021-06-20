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

/** 
 * Turns an npc into a loot sheet while removing anything that doesn't
 * look like an "item".
 */

let d = new Dialog({
  title: 'Convert NPC to lootable body',
  content: `This is a destructive operation, are you sure?`,
  buttons: {
    cancel: {
      icon: '<i class="fas fa-ban"></i>',
      label: 'Cancel'
    },
    convert: {
      icon: '<i class="fas fa-thumbs-up"></i>',
      label: 'Convert',
      callback: (html) => {
        TurnSelectedToLoot(false);
      }
    },
    convertAdd: {
      icon: '<i class="fas fa-coins"></i>',
      label: 'Add Gold',
      callback: (html) => {
        TurnSelectedToLoot(true);
      }
    }
  },
  default: 'cancel',
}).render(true);

async function TurnSelectedToLoot(addCurrency = false){
  // For each selected token.

  let tokens = canvas.tokens.controlled;

  for (let token of tokens) {
    /////
    // Allowlist of token's actor types we're allowed to work on.
    // Could just block "character" (PCs), but let's future-proof
    // against unknown types instead.
    if (token.actor.data.type != 'npc' || token.data.actorLink)
      continue;

    /////
    // Cleanup actor's items to be only those we want to be lootable.
    //console.log('Items:', token.actor.data.items);
    let itemsToDelete = token.actor.items
      .filter(item => {
        // Weapons are fine, unless they're natural.
        if (item.type == 'weapon') {
          return item.data.data.weaponType == 'natural';
        }

        // Equipment's fine, unless it's natural armor.
        if (item.type == 'equipment') {
          return item.data.data.armor.type == 'natural';
        }

        // Item type blocklist.
        // Less intuitive than an allowlist,
        // but permits unknown module items.
        return (['class', 'spell', 'feat']
          .includes(item.type));
      }).map(item => item.id);
    
    //console.log('Lootables:', newItems);
    await token.document.actor.deleteEmbeddedDocuments("Item",itemsToDelete);

    /////
    // Change sheet to lootable, and give players permissions.
    //console.log('Flags before: '); console.log(token.actor.data.flags);
    // console.log('Currency before:', token.actor.data.data.currency);
    let newActorData = {
      'flags': {
        'core': {
          'sheetClass': 'dnd5e.LootSheet5eNPC'
        },
        'lootsheetnpc5e': {
          'lootsheettype': 'Loot'
        }
      }
    };
    // Add proper currency info to the new data, if the actor needs it.
    if (undefined == token.actor.data.data.currency
      || token.actor.data.data.currency.cp === 0 // should be an object, not a number
    ) {
      newActorData['data.currency'] = {
        'cp': {'value': 0},
        'ep': {'value': 0},
        'gp': {'value': 0},
        'pp': {'value': 0},
        'sp': {'value': 0}
      };
    } else {
        newActorData['data.currency'] = token.actor.data.data.currency;
    }

    /** optional blocklist */
    //let user_blocklist = ['HoneyBadger'];
    let user_blocklist=[];

    // Players and Trusted Players (no guests or GMs).  NEVER include the GM!
    //Only open up permissions to currently logged in players
    let lootingUsers= game.users.filter(user => {return user.role >= 1 && user.role <= 2 && !user_blocklist.includes(user.name) && user.active});

    //console.log('Looting users:', lootingUsers);

    /** find if the actor has any gold already on its person */
    let currencyArray = [];
    for (const currency in newActorData){
      currencyArray.push(newActorData[currency].value);
    }
    const hasGold = Math.max(...currencyArray) > 0;

    /** if the actor has no gold, assign gold by CR (custom gold scaling equation LOOSELY in line with DMG tables */
    if (!hasGold && addCurrency){
      const exponent = 0.15 * (getProperty(token.actor, "data.data.details.cr") ?? 0);

      let gold = Math.round(0.6 * 10 * (10 ** exponent));

      /** ensure it can devide evenly across all looting players (convienence) */
      gold = gold + (lootingUsers.length) - (gold % Math.max(lootingUsers.length, 1)) ?? 0;

      newActorData['data.currency.gp.value'] = gold;
    }

    await token.document.actor.update(newActorData);
    //console.log('Flags after: '); console.log(token.actor.data.flags);
    //console.log('Currency after:', token.actor.data.data.currency);

    /////
    // Update permissions so users can loot stuff by themselves.
    if (lootingUsers.length > 0) {
      // Permissions level 2 lets users loot, but not edit willy-nilly.
      // Level 3 is what GMs have (general editing).
      let permissions = {};
      Object.assign(permissions, token.actor.data.permission);
      lootingUsers.forEach(user => {
        permissions[user.data._id] = 2;
      });
      //console.log('Permissions:', permissions);
      await token.document.update({
        "overlayEffect" : 'icons/svg/chest.svg',
        "actorData": {
          "actor": {
            "flags": {
              "loot": {
                "playersPermission": 2
              }
            }
          },
          "permission": permissions
        }
      });
    }
  }
}
