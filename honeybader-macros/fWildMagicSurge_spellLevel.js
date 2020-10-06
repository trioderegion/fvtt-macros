/** Parameters: args[0] = Spell level to check for wild magic surge */

/** Note: this is a homebrewed version of Wild Magic Surge that will surge
 *        on a d20 roll where the result is less than or equal to the
 *        level of the spell just cast. MOAR SURGES!!
 */
const spellLevel = args[0];

const roll = new Roll("1d20").roll();
const d20result = roll["result"];
if (d20result <= spellLevel) {
      ChatMessage.create({
        content: "<i>surges as a level "+spellLevel+" spell is cast!</i>",
        speaker: ChatMessage.getSpeaker({alias: "The Weave"})
      });
      
      /** USAGE NOTE: replace this table name with the table to draw from */
      game.tables.getName("Wild-Magic-Surge-Table").draw();
}
else{
      ChatMessage.create({
         content: "<i>remains calm as a level "+spellLevel+" spell is cast...</i>",
         speaker: ChatMessage.getSpeaker({alias: "The Weave"})
      });
}