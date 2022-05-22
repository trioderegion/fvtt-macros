/* DnD5e Light Cantrip
 * Requires: Warpgate and a plain actor named "Default" in the world
 * Intended for execution via Item Macro directly
 */

const position = await warpgate.crosshairs.show({label: 'Select target token or location', drawIcon: false, size: 0.5});

const tokens = warpgate.crosshairs.collect(position);

let lightData = {
    "dim": 40,
    "bright": 20
    "angle": 0,
    "color": "#330547",
    "alpha": 0.1,
    "animation": {
        "type": "dome",
        "speed": 5,
        "intensity": 8,
        "reverse": false
    },
    "coloration": 2,
    "gradual": true,
    "luminosity": 0.25,
    "saturation": 0,
    "contrast": 0,
    "shadows": 0,
    "darkness": {
        "min": 0,
        "max": 1
    }
}

if (tokens.length == 0) {
    /* spawning a token with light */
    await warpgate.spawnAt(position, "Default", {token: {light: lightData, img:'modules/jb2a_patreon/Library/Cantrip/Dancing_Lights/DancingLights_01_PurpleGreen_200x200.webm', scale: 0.5, height:0.5, width: 0.5, name:'*', 'bar1.attribute': ''}})
} else {
    const target = tokens[0];
    lightData.bright = Math.max(lightData.bright, target.data.light.bright);
    lightData.dim = Math.max(lightData.dim, target.data.light.dim);
    await warpgate.mutate(target, {token: {light: lightData}}, {}, {name: "Light Spell", description: `Upgrading to ${lightData.dim} dim and ${lightData.bright} bright light by ${token.name}. Revert to remove.`})
}
