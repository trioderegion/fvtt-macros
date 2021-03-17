/** Animated Objects attack/damage macro
  * intended for Item Macro, but is simple to remove
  * look for 'item.roll()' and delete
*/

/*
  quickDialog
    Send an array of data to build a Vertical Input Dialog of Multiple Types
    returns a promise (value is an Array of the chosen values)
  data = [{}]
  {} = {
    type : `type of input`, //text, password, radio, checkbox, number, select
    label : `Whatever you want to be listed`,
    options : [``] or ``
  }
*/
async function quickDialog({data, title = `Quick Dialog`} = {})
{
  data = data instanceof Array ? data : [data];

  return await new Promise((resolve) => {
    let content = `
    <table style="width:100%">
      ${data.map(({type, label, options}, i)=> {
        if(type.toLowerCase() === `select`)
        {
          return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><select id="${i}qd">${options.map((e,i)=> `<option value="${e}">${e}</option>`).join(``)}</td></tr>`;
        }else if(type.toLowerCase() === `checkbox`){
          return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><input type="${type}" id="${i}qd" ${options || ``}/></td></tr>`;
        }else{
          return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><input type="${type}" id="${i}qd" value="${options instanceof Array ? options[0] : options}"/></td></tr>`;
        }
      }).join(``)}
    </table>`;

    new Dialog({
      title, content,
      buttons : {
        Ok : { label : `Ok`, callback : (html) => {
          resolve(Array(data.length).fill().map((e,i)=>{
            let {type} = data[i];
            if(type.toLowerCase() === `select`)
            {
              return html.find(`select#${i}qd`).val();
            }else{
              switch(type.toLowerCase())
              {
                case `text` :
                case `password` :
                case `radio` :
                  return html.find(`input#${i}qd`)[0].value;
                case `checkbox` :
                  return html.find(`input#${i}qd`)[0].checked;
                case `number` :
                  return html.find(`input#${i}qd`)[0].valueAsNumber;
              }
            }
          }));
        }}
      }
    }).render(true);
  });
}
   
   
   
(async () => {
  await item.roll(); //remove if not using ItemMacro
  let attackdata = [
    {type : `select`, label : `Object size : `, options : [`Tiny`,`Small`,`Medium`,`Large`,`Huge`]},
    {type : `select`, label : `Number of attacks : `, options : [1,2,3,4,5,6,7,8,9,10]},
    {type : `select`, label : `Modifier : `, options : ['None', 'Advantage', 'Disadvantage']},
  ];

  const [size, num, mod] = await quickDialog({ data: attackdata, title : `Attack Configuration` });

  let toHit = 0;
  let damage = '';
  let critical = '';
  let modstring = '';
  let numd20 = 1;
  
  switch (size){
    case 'Tiny': toHit = 8; damage = '1d4+4'; critical = '2d4+4';
        break;
    case 'Small': toHit = 6; damage = '1d8+2'; critical = '2d8+2';
        break;
    case 'Medium': toHit = 5; damage = '2d6+1'; critical = '4d6+1';
        break;
    case 'Large': toHit = 6; damage = '2d10+2'; critical = '4d10+2';
        break;
    case 'Huge': toHit = 8; damage = '2d12+4'; critical = '4d12+4';
        break;
    
  }
  
  switch (mod){
      case 'Advantage': modstring = 'kh'; numd20 = 2; break;
      case 'Disadvantage': modstring = 'dl'; numd20 = 2; break;
  }

  for(let attack = 0; attack < num; attack++){
      let roll = new Roll(`${numd20}d20${modstring}+${toHit}`).roll()
      await roll.toMessage({flavor: `Attack ${attack+1}, ${size} object`});
  }

  
  const hitquery = [
      {type : `select`, label : `Critical Hits : `, options : [0,1,2,3,4,5,6,7,8,9,10]},
      {type : `select`, label : `Normal Hits : `, options : [0,1,2,3,4,5,6,7,8,9,10]},
      ]
      
    const [numCrits, numHits] = await quickDialog({data: hitquery, title : 'Damage Configuration'})
    
  for( let crit = 0; crit < numCrits; crit++){
    let roll = new Roll(critical).roll()
      await roll.toMessage({flavor: `Critical hit ${crit+1}, ${size} object`});
  }
  
  for( let dam = 0; dam < numHits; dam++){
    let roll = new Roll(damage).roll()
      await roll.toMessage({flavor: `Normal hit ${dam+1}, ${size} object`});
  }

})();