/* This will set every token in scene to always display their
 * token bars and nameplate based on their hostility, and sets the first bar to represent 
 * HP and removes the second token bar.
*/
//note: not my (honeybadger) original script, simply modified from one found.

const tokens =canvas.tokens.placeables.map(token => {
   if (token.data.disposition == CONST.TOKEN_DISPOSITIONS.HOSTILE) {
       return {
           _id: token.id,
           "bar1.attribute": "attributes.hp",
           "bar2.attribute": "",
           "displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
           "displayBars": CONST.TOKEN_DISPLAY_MODES.HOVER
       };
   }
   else { return {
              _id: token.id,
           "bar1.attribute": "attributes.hp",
           "bar2.attribute": "",
           "displayName": CONST.TOKEN_DISPLAY_MODES.HOVER,
           "displayBars": CONST.TOKEN_DISPLAY_MODES.HOVER
         };
   }
});

canvas.scene.updateEmbeddedEntity('Token', tokens)