import Immutable from 'immutable';
import _ from 'lodash';

export const getChildrenIds = (parentNode) => {
    let ids = [];
    parentNode.children.forEach((node) => {
        if (node.children && node.children.length > 0) {
            ids = ids.concat([node.id, ...getChildrenIds(node)]);
        } else {
            ids.push(node.id);
        }
    });

    return ids;
};

export const checkNodeAndGetCheckedIds = (checkedIds, node, value) => {
    let checked = Immutable.Set(checkedIds);

    if (node.expandable) {                                              // If node has children
        const childrenIds = getChildrenIds(node);
        checked = value
            ? checked.union([node.id, ...childrenIds])                  // Check all children
            : checked.subtract([node.id, ...childrenIds]);              // Uncheck all children
    } else {
        checked = value ? checked.add(node.id) : checked.delete(node.id);
    }

    _.forEachRight(node.parents, (parent) => {                           // Iterate over all parents of node to check/uncheck them
        if (getChildrenIds(parent).every(id => checked.has(id))) {       // If every children of parent is checked
            if (checked.has(parent.id)) {                                // If parent is already checked
                return false;
            }

            checked = checked.add(parent.id);                            // Check such parent
        } else {
            if (!checked.has(parent.id)) {                               // If parent is still not checked
                return false;
            }

            checked = checked.delete(parent.id);                         // Uncheck such parent
        }
    });

    return checked.toArray();
};
