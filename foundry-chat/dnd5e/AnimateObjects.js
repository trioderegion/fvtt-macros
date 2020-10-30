// by: Kekilla
// https://discordapp.com/channels/170995199584108546/699750150674972743/769288707362390026

(async ()=> {
  const values = {
    Tiny : [20,18,8,`1d4 + 4`],
    Small : [25,16,6,`1d8 + 2`],
    Medium : [40 ,13,5,`2d6 + 1`],
    Large : [50,10,6,`2d10 + 2`],
    Huge : [80,10,8,`2d12 + 4`]
  };

  let target = Array.from(game.user.targets)[0];
  if(!target) return;

  let choice = await choose(Object.keys(values), `Choose object size : `);

  let attack_modifier = values[choice][2], damage_dice = values[choice][3], { ac } = target.actor.data.data.attributes;

  let attacks = Array(10)
    .fill(0)
    .map(e=> new Roll(`1d20 + ${attack_modifier}`).roll().total);
  let damage = attacks
    .filter(e=> e >= ac.value )
    .map(e=> new Roll(`${damage_dice}`).roll().total )
    .reduce( (acc,val) => acc+=val, 0);

  ChatMessage.create({
    /*flavor : `${character.name} casts animate objects!`,*/
    content : `${choice} objects! <br> HP : ${values[choice][0]} / AC : ${values[choice][1]} <br> Attack : +${values[choice][2]} to hit, ${values[choice][3]} damage <br> Consolidated Damage done : ${damage}`,
    speaker : ChatMessage.getSpeaker()
  });
})();

async function choose(options = [], prompt = ``)
{
  let value = await new Promise((resolve) => {

    let dialog_options = (options[0] instanceof Array)
      ? options.map(o => `<option value="${o[0]}">${o[1]}</option>`).join(``)
      : options.map(o => `<option value="${o}">${o}</option>`).join(``);
  
    let content = `
    <table style="width=100%">
      <tr><th>${prompt}</th></tr>
      <tr><td><select id="choice">${dialog_options}</select></td></tr>
    </table>`;
  
    new Dialog({
      content, 
      buttons : { OK : {label : `OK`, callback : async (html) => { resolve(html.find('#choice').val()); } } }
    }).render(true);
  });
  return value;
}
