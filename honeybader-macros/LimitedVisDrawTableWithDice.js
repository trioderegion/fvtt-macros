const thisTable = game.tables.getName("table");
const thisRoll = thisTable.roll();
await game.dice3d.showForRoll(thisRoll.roll); //show this roll via DSN
await thisTable.draw(thisRoll);