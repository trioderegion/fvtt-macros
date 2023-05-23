/** 
 * Migrate the "legacy" data created from the prototype masking scripts
 * into the data needed for the module version of Archon.
 *
 * BACKUP YOUR WORLD PRIOR TO EXECUTION
 *
 * See <https://ko-fi.com/post/Badger-Scripts-Masked-Items-U6U7KAGRY>
 * for instructions.
 */

const legacyFilter = i => getProperty(i, 'flags.warpgate.archon')

let legacyArchons = Array.from(game.scenes).flatMap( scene => {

    const actors = scene.tokens.map( t => t.actor );
    const legacyArchons = actors.flatMap( a => 
        a?.items.filter(legacyFilter) ?? []);
    return legacyArchons;
});

const sidebarArchons = game.items.filter(legacyFilter);
legacyArchons = legacyArchons.concat(sidebarArchons);

console.log('Found legacy archons: ', legacyArchons);

const results = await Promise.all(legacyArchons.map( i => i.update({
    'flags.warpgate.-=archon': null,
    'flags.archon.source': legacyFilter(i),
    'flags.archon.uuid': true,
    })));

ui.notifications.info(`Migrated ${results.length} legacy archons across all scenes and sidebar.`);
console.log('Migration results:', results);
