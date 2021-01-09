/** Cobbled together from a script I found (sorry original author :( )
 * Turns an npc into a loot sheet while removing anything that doesn't
 * look like an "item".
 */
async function TurnSelectedToLoot(){
  // For each selected token.

  for (let token of canvas.tokens.controlled) {
    /////
    // Allowlist of token's actor types we're allowed to work on.
    // Could just block "character" (PCs), but let's future-proof
    // against unknown types instead.
    if (token.actor.data.type != 'npc')
      continue;

    /////
    // Cleanup actor's items to be only those we want to be lootable.
    //console.log('Items:', token.actor.data.items);
    let newItems = token.actor.data.items
      .filter(item => {
        // Weapons are fine, unless they're natural.
        if (item.type == 'weapon') {
          return item.data.weaponType != 'natural';
        }
        // Equipment's fine, unless it's natural armor.
        if (item.type == 'equipment') {
          if (!item.data.armor)
            return true;
          return item.data.armor.type != 'natural';
        }
        // Item type blocklist.
        // Less intuitive than an allowlist,
        // but permits unknown module items.
        return !(['class', 'spell', 'feat']
          .includes(item.type));
      })
    ;
    //console.log('Lootables:', newItems);
    await token.actor.update({
      "items": newItems
    });

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
      || token.actor.data.data.currency.cp == 0 // should be an object, not a number
    ) {
      newActorData['data.currency'] = {
        'cp': {'value': 0},
        'ep': {'value': 0},
        'gp': {'value': 0},
        'pp': {'value': 0},
        'sp': {'value': 0}
      };
    }

    /** optional blocklist */
    //let user_blocklist = ['HoneyBadger'];
    let user_blocklist=[];
    let lootingUsers= game.users.entries
    // Players and Trusted Players (no guests or GMs).  NEVER include the GM!
      .filter(user => {return user.role >= 1 && user.role <= 2});
    //console.log('Looting users:', lootingUsers);


    /** find if the actor has any gold already on its person */
    let currencyArray = [];
    for (const currency in newActorData){
      currencyArray.push(newActorData[currency].value);
    }
    //const hasGold = Math.max.apply(Math.max,currencyArray) > 0;
    const hasGold = Math.max(...currencyArray) > 0;

    /** if the actor has no gold, assign gold by CR (custom gold scaling equation LOOSELY in line with DMG tables */
    if (!hasGold){
      const exponent = 0.15 * (getProperty(token.actor, "data.data.details.cr") ?? 0);

      let gold = Math.round(0.6 * 10 * (10 ** exponent));

      /** ensure it can devide evenly across all looting players (convienence) */
      gold = gold + (gold % Math.max(lootingUsers.length, 1)) ?? 0;

      newActorData['data.currency'].gp.value = gold;
    }

    await token.actor.update(newActorData);
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
      await token.update({
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

TurnSelectedToLoot();
