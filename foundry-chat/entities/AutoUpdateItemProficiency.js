// original poster: @Kandashi#6698
/// running this on world launch/refresh will auto update items that are added to the PC's sheets to reflect their proficiencies. If it cannot determine proficiency it will notify you to adjust manually.
Hooks.on("createOwnedItem", (actor, item ,sheet, id) =>{
    let itemName = item.name;
    let itemType = item.data.weaponType;
    let actorProfs = actor.data.data.traits.weaponProf;
if(actorProfs.value.find(i => i === "sim") && itemType === ("simpleM" || "simpleR" )){
    const updates = {_id: item._id, "data.proficient": true};
        actor.updateOwnedItem(updates);
    return;
} if(actorProfs.value.find(i => i === "mar") && itemType === ("martialM" || "martialR" )){
    const updates = {_id: item._id, "data.proficient": true};
        actor.updateOwnedItem(updates);
        return;
} if(actorProfs.custom.includes(itemName)){
    const updates = {_id: item._id, "data.proficient": true};
        actor.updateOwnedItem(updates);
        return;
} if(!(actorProfs.custom.includes(itemName))) {
     ui.notifications.notify("Item Name could not be matched to proficiency , please adjust manually")
}
});