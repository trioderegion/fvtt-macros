//Click rotates clockwise, ctrl+click counter, alt+click resets. For all selected tokens.

let updates = [];

if(event.ctrlKey){
    canvas.tokens.controlled.forEach(token => updates.push({_id : token.id, "rotation" : token.data.rotation - 90}));
}
else if(event.altKey){
    canvas.tokens.controlled.forEach(token => updates.push({_id: token.id, "rotation" : 0}));
}
else{
    canvas.tokens.controlled.forEach(token => updates.push({_id: token.id, "rotation" : token.data.rotation + 90}));
}

canvas.tokens.updateMany(updates);