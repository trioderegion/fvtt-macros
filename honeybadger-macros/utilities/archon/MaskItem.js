/** 
 * Mask Item
 * Requres: warpgate 1.6+
 * See <https://ko-fi.com/post/Badger-Scripts-Masked-Items-U6U7KAGRY>
 * for instructions.
 */

const result = await warpgate.menu({
    inputs: [{type:'text', label: 'Item UUID: ', options: ''}]
}, {title: 'Mask Item by UUID'})

if(!result.buttons) return;

const [uuid] = result.inputs;

const sourceItem = await fromUuid(uuid);
const sourceData = sourceItem.toObject();

const maskedData = {
    name: 'Nothing Special',
    type: sourceData.type,
    flags: {
        warpgate: {
            archon: sourceData
        }
    }
}

const maskedItem = await Item.implementation.create(maskedData);
maskedItem.sheet.render(true);
