(()=>{
  let message = game.messages
    .filter(message => message.data.content.includes(`dnd5e chat-card item-card`))
    .pop();

  //this will get you the last message that was a dnd5e chat-card

  //to do : find a way to parse the string for actor_id/item_id
  let actor_id = /data-actor-id="(.*?)"/g.exec(message.data.content)[1];
  let item_id = /data-item-id="(.*?)"/g.exec(message.data.content)[1];

  let item = game.actors.get(actor_id).items.get(item_id);

  console.log(item);
})();