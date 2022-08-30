/*
Author: honeybadger#2614

System Agnostic* Trading
Requires: Warp Gate v1.11.0+
Features: Item trading and currency trading* between tokens.

Disclaimer: currency trading only compatible with DnD5e.

Requires Warp Gate v1.11.0 or greater
*/

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

