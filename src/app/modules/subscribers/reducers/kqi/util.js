export function normalize({previous, current}) {
    const byId = {};
    const list = [];

    for (const currentItem of current) {
        byId[currentItem.id] = {
            current: currentItem,
            previous: null,
        };
        list.push(currentItem.id);
    }

    for (const previousItem of previous) {
        if (byId[previousItem.id] === undefined) {
            byId[previousItem.id] = {
                current: null,
                previous: previousItem,
            };
            list.push(previousItem.id);
        } else {
            byId[previousItem.id].previous = previousItem;
        }
    }

    return {
        byId,
        list,
    };
}
