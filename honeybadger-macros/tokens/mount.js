/**************************************************************************
MIT License
Copyright (c) 2022 Matthew Haentschke
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
****************************************************************************/

/**** README ******
 * Instructions for use and setup can be found here
 * https://ko-fi.com/post/Badger-Scripts-Mount-Companion-Z8Z6EH76Y
 * 
 * Also pairs well with the Primal Companion summoning script found here (for supporters)
 * https://ko-fi.com/post/Badger-Scripts-Summoner-based-Companion-Scaling-Z8Z5E8AVN
 ******************/

/* Primal Companion class identifier */
const compClsId = 'primalcomp';

const rangerToken = token ?? character?.getActiveTokens()[0];

if(!rangerToken) {
    ui.notifications.warn('Could not locate your possessed or controlled token.');
    return;
}

const ranger = rangerToken.actor;

/* find the companion, assuming its spawned and controlled by the ranger */
let companionToken = canvas.tokens.placeables.find( token => {
    const controllerId = token.actor.getFlag('warpgate','control')?.actor;
    return controllerId == ranger.id && (compClsId in token.actor.classes)
})

/* fallback is to use the first target */
companionToken = !!companionToken ? companionToken : game.user.targets.first();

if(!companionToken) {
    ui.notifications.warn('Could not find a companion controlled by your Actor or a targeted token.')
    return;
}

let {width, height, scale} = rangerToken.data;
const scaleDown = (width == companionToken.data.width) && (height == companionToken.data.width)

/* following companion already? */
const leaders = rangerToken.document.getFlag('squadron','leaders') ?? {};

if( companionToken.id in leaders ) {
    /* we are following already, restore scale and stop */

    if( !!warpgate.mutationStack(rangerToken.document).getName('Mounted') ) {
        await warpgate.revert(rangerToken.document, 'Mounted');
    }
    
    await squadron.stop(rangerToken.document);
} else {
    /* we want to start following */

    /* move ranger token to center of companion, with an offset */
    const {x,y} = companionToken.center;

    await rangerToken.document.update({x, y}, {animateMovement: false});

    if (scaleDown) {
        /* scale down ranger */
        width/=2;
        height/=2;
        scale+=0.5;
        await warpgate.mutate(rangerToken.document, {token: {width, height, scale}}, {}, {name: 'Mounted'});
    }

    await squadron.follow(companionToken.id, rangerToken.id, canvas.scene.id, squadron.CONST.NONE, {snap: false});
}
