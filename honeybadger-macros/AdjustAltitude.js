//Click goes up, ctrl+click down, alt+click lands

let updates = [];

if(event.ctrlKey){
    canvas.tokens.controlled.forEach(token => updates.push({_id : token.id, "elevation" : token.data.elevation - 5}));
}
else if(event.altKey){
    canvas.tokens.controlled.forEach(token => updates.push({_id: token.id, "elevation" : 0}));
}
else{
    canvas.tokens.controlled.forEach(token => updates.push({_id: token.id, "elevation" : token.data.elevation + 5}));
}

canvas.tokens.updateMany(updates);