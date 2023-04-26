await token.document.update({x:300,y:300});
ui.notifications.info("Starting...");
await CanvasAnimation.getAnimation(token.animationName)?.promise
ui.notifications.info("Done")
