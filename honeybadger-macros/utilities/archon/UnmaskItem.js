const archons = token?.actor?.items.filter( item => !!item.getFlag('warpgate','archon')) ?? [];

const choice = await warpgate.buttonDialog({
    buttons: archons.length > 0 ? archons.map( item => {
            const archon = item.getFlag('warpgate','archon');
            mergeObject(archon.flags, {warpgate: {archon: false}});
            return {
                value: {id: item.id, name: item.name, archon},
                label: `${item.name} to ${archon.name}`
            }
    }) : [{value: false, label: 'Close'}],
    title: `Unmasking Item from ${token.name}`,
}, 'column');

if(!choice) return;

const updates = {
    embedded: {
        Item: {
            [choice.id]: choice.archon
        }
    }
}

const options = {
    permanent: true,
    description: `Unmasking ${choice.name}`,
    comparisonKeys: {Item: 'id'}
}

await warpgate.mutate(token.document, updates, {}, options)
