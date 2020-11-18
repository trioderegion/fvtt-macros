/** Click goes up, ctrl+click down, alt+click lands */

if(event.ctrlKey){
    token.update({"elevation" : token.data.elevation - 5});
    return;
}

if(event.altKey){
    token.update({"elevation" : 0});
    return;
}

token.update({"elevation" : token.data.elevation + 5});