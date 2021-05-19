/** Animate Objects Summon */
// USAGE NOTE: Replace list of "gActorName" assignments with your actor names


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

function getMousePosition() {
  const mouse = canvas.app.renderer.plugins.interaction.mouse;
  return mouse.getLocalPosition(canvas.app.stage);
}

function getCenterGrid(point = {})
{
  const arr = canvas.grid.getCenter(point.x, point.y);
  return { x: arr[0], y : arr[1] };
}

/*
  Capture Click
 */
let gNumSpawned = 0;
let gNeedSpawn = 100;
let gCurrentActor;
async function handleClick(event){
    if(gNumSpawned < gNeedSpawn && !!gCurrentActor){
        await spawnActor(gCurrentActor);
        gNumSpawned++
    }
}

function captureClick()
{
  $(document.body).on("click", handleClick);
}

function stopCapture() {
   $(document.body).off("click", handleClick); 
}

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function sleepWhilePlacing(){
    while(gNumSpawned<gNeedSpawn){
        await wait(100);
    }
}

//global current token to spawn

async function spawnActor(actorName) {
     const scene = game.scenes.get(game.user.viewedScene);
     let protoToken = duplicate(game.actors.getName(actorName).data.token);

     let location = getCenterGrid(getMousePosition());

     protoToken.x = location.x;
     protoToken.y = location.y;
     
     // Increase this offset for larger summons
     protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
     protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);
     
     return canvas.tokens.createMany(protoToken,{});
 }

(async () => {
  //await item.roll();
    let attackdata = [
        {type : `select`, label : `Tiny : `, options :[0,1,2,3,4,5,6,7,8,9,10]},
        {type : `select`, label : `Small : `, options : [0,1,2,3,4,5,6,7,8,9,10]},
        {type : `select`, label : `Medium : `, options : [0,1,2,3,4,5]},
        {type : `select`, label : `Large : `, options : [0,1,2]},
        {type : `select`, label : `Huge : `, options : [0,1]},
    ];
    
    const [tinyNum, smallNum, mediumNum, largeNum, hugeNum] = await quickDialog({ data: attackdata, title : `Summon Configuration` });

    await wait(500);
    
    captureClick();
     
    gCurrentActor = "Tiny Object";
    gNumSpawned = 0;
    gNeedSpawn = parseInt(tinyNum);
    
    await sleepWhilePlacing();
    
    gCurrentActor = "Small Object";
    gNumSpawned = 0;
    gNeedSpawn = parseInt(smallNum);

    await sleepWhilePlacing();
    
    gCurrentActor = "Medium Object";
    gNumSpawned = 0;
    gNeedSpawn = parseInt(mediumNum);

    await sleepWhilePlacing();
    
    gCurrentActor = "Large Object";
    gNumSpawned = 0;
    gNeedSpawn = parseInt(largeNum);

    await sleepWhilePlacing();
    
    gCurrentActor = "Huge Object";
    gNumSpawned = 0;
    gNeedSpawn = parseInt(hugeNum);

    await sleepWhilePlacing();
    
    stopCapture();
    
    ui.notifications.info("Done!");
    
})();
