/**************************************************************************
MIT License
Copyright (c) 2023 Matthew Haentschke
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

/*
Requires: Warp Gate, Item Piles

System: DnD5e (for currency modification). Agnostic otherwise.

Setup: It is recommended to add the following filter to Item Pile's default 
filter: data.weaponType | natural. Which will filter out the natural weapons
found on many creatures. Alternatively, define the `shouldBeLoot` filter function

DESTRUCTIVE MODIFICATION of the selected tokens to a SINGLE lootable body with
the option of adding treasure (gold, silver, copper) roughly in-line with
the Individual Treasure by CR tables. 
*/

const untouchedPile = 'icons/containers/chest/chest-reinforced-box-brown.webp';
const openedPile = 'icons/containers/chest/chest-wooden-tied-white.webp';
const emptyPile = 'icons/svg/invisible.svg';

const shouldBeLoot = (item) => true;

const buttons = [
  {
    label: '<i class="fas fa-thumbs-up"></i>Convert',
    value: () => {
      return TurnSelectedToLoot(false);
    }
  },
  {
    label: '<i class="fas fa-coins"></i>Convert and Add Gold',
    value: () => {
      return TurnSelectedToLoot(true);
    }
  },
  {
    label: '<i class="fas fa-ban"></i>Cancel',
    value: false
  }
]

const response = await warpgate.buttonDialog({
  buttons, 
  title: 'Convert NPC to lootable body',
  content: `<div style="text-align:center;">This operation can be reverted via Warp Gate.</div>`
}, 'column')

if (!response) return;

await response();

async function TurnSelectedToLoot(addCurrency = false){

    if (!canvas.tokens.controlled.length) {
      ui.notifications.info("Please select tokens to convert to lootable piles.")
      return;
    }

    // Players and Trusted Players (no guests or GMs).
    const numPlayers = game.users.filter(user => {return user.role >= 1 && user.role <= 2 && user.active}).length;

    const ActiveEffect = token.actor.effects.reduce( (acc, curr) => {
        acc[curr.data.label] = warpgate.CONST.DELETE;
        return acc;
        }, {})

    let updates = {
        token: {
            'texture.src': untouchedPile, 
            name: 'Pile of Lewt',
        },
        actor: {
            system: {currency: {gp:0, sp:0, cp:0}},
            name: 'Pile of Loot',
        },
        embedded: {
            ActiveEffect,
            Item: {}
        }
    }

    //map the update data
    const singlePile = canvas.tokens.controlled.reduce( (acc, tok) => {
        /* get their items */
        const items = tok.actor.items.reduce( (acc, item) => {
            if(shouldBeLoot(item)) {
                acc[randomID()] = item.toObject();
            }

            return acc;
        }, {} )

        foundry.utils.mergeObject(acc.embedded.Item, items);

        if(addCurrency) {

            /* Adjust as needed -- this very loosely approximates individual treasure by CR */
            const exponent = 0.15 * (getProperty(tok.actor, "system.details.cr") ?? 0);
            let gold = Math.round(0.6 * 10 * (10 ** exponent));

            /** ensure it can devide evenly across all looting players (convienence) */
            gold = gold + (numPlayers) - (gold % Math.max(numPlayers, 1)) ?? 0;

            /** split a random percentage to silver (no more than half)*/
            const silverPct = Math.random()/2;
            const convertedGold = Math.floor(gold * silverPct);
            let silver = convertedGold * 10;
            gold -= convertedGold

            /** split a random percentage to copper (no more than half silver) */
            const cprPct = Math.random()/2;
            const convertedSilver = Math.floor(silver * cprPct);
            let copper = convertedSilver * 10;
            silver -= convertedSilver

            /** Add onto any currency the actor may already have */
            gold += acc.actor.system.currency.gp + getProperty(tok.actor, 'system.currency.gp') ?? 0 
            silver += acc.actor.system.currency.sp + getProperty(tok.actor, 'system.currency.sp') ?? 0
            copper += acc.actor.system.currency.cp + getProperty(tok.actor, 'system.currency.cp') ?? 0

            acc.actor.system.currency = {gp: gold, sp: silver, cp: copper};
        }

        return acc;
   
    }, updates)

    const toDelete = canvas.tokens.controlled.filter( t => t.id !== token.id ).map( t => t.id );
    await canvas.scene.deleteEmbeddedDocuments('Token', toDelete);

    await warpgate.mutate(token.document, singlePile, {}, {permanent:true, comparisonKeys: {ActiveEffect: 'label', Item: 'id'}})

    await ItemPiles.API.turnTokensIntoItemPiles(token, {
        pileSettings: {
        openedImage: openedPile,
        emptyImage: emptyPile,
        isContainer: true,
        deleteWhenEmpty: false,
        activePlayers:true,
        closed: true
        }
    })
    
}
