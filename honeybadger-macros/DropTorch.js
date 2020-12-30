//Drops a 0.5 sized token in the controlled token's current square and 
//reduces vision if it appears like the torch was the only source of light.
//author: honeybadger#2614

if (canvas.tokens.controlled.length !== 1) {
  ui.notifications.error("Please select only one token.");
}
else{
  for ( let charToDrop of canvas.tokens.controlled ) {
    Token.create({
      name: "Dropped Torch",
      x: charToDrop.data.x,
      y: charToDrop.data.y,
      img: "systems/dnd5e/icons/items/inventory/torch.jpg",
      width: 0.5,
      height: 0.5,
      scale: 1,
      lockRotation: false,
      rotation: 0,
      vision: true,
      dimLight: 40,
      brightLight: 20,
      hidden: false,
      actorLink: false,
      actorData: {},
      disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
      lightColor: "#ffa742"
    });
    let dialogEditor = new Dialog({
  title: `Token Light Picker`,
  content: `Pick the token's resulting light source.`,
  buttons: {
    none: {
      label: `None`,
      callback: () => {
        charToDrop.update({"dimLight": 0, "brightLight": 0, "lightAngle": 360,});
      }
    },
    candle: {
      label: `Candle`,
      callback: () => {
        charToDrop.update({"dimLight": 10, "brightLight": 5, "lightAngle": 360, "lightColor": "#ffa742",});
      }
    },
  },
  default: "none",
  close: () => {}
});

dialogEditor.render(true)
  }
}