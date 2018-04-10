import { getChildrenIds, checkNodeAndGetCheckedIds } from '../tree';

describe('tree', () => {
    const data = [{
        id: 1,
        expandable: true,
        children: [{
            id: 2,
            expandable: true,
            children: [{
                id: 4,
            }],
        }, {
            id: 3,
            parents: [{ id: 1, children: [{ id: 2, children: [{ id: 4 }] }, { id: 3 }] }]
        }],
    }];

    const rootNode = data[0];

    it('getting children ids', () => {
        expect(getChildrenIds(rootNode)).toEqual([2, 4, 3]);
    });

    it('check root node', () => {
        expect(checkNodeAndGetCheckedIds([], rootNode, true)).toEqual([1, 2, 4, 3]);
    });

    it('uncheck root node', () => {
        expect(checkNodeAndGetCheckedIds([1, 2, 3, 4], rootNode, false).length).toBe(0);
    });

    it('check single node', () => {
        const singleNode = rootNode.children[1];
        expect(checkNodeAndGetCheckedIds([], singleNode, true)).toEqual([singleNode.id]);
    });

    it('uncheck single node', () => {
        const singleNode = rootNode.children[1];
        expect(checkNodeAndGetCheckedIds([singleNode.id], singleNode, false).length).toBe(0);
    });
});