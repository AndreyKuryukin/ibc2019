import { naturalSort } from '../sort';

describe('natural sorting', () => {
    const data = [
        {
            id: 2,
            name: 'Name 2',
            lastName: 'Last name 2',
        },
        {
            id: 1,
            name: 'Name 1',
            lastName: 'Last name 1',
        },
        {
            id: 3,
            name: 'Name 2',
            lastName: 'Last name 1',
        },
    ];
    const sortDataAndGetIds = (orders, extractor) => naturalSort(data, orders, extractor).map(item => item.id);
    const extractor = (item) => [
        item.name ? item.name.toLowerCase() : '',
        item.lastName ? item.lastName.toLowerCase() : '',
    ];

    it('data should be sorted by name ascending and last name ascending', () => {
        const orders = ['asc', 'asc'];

        expect(sortDataAndGetIds(orders, extractor)).toEqual([1, 3, 2]);
    });

    it('data should be sorted by name descending and last name descending', () => {
        const orders = ['desc', 'desc'];

        expect(sortDataAndGetIds(orders, extractor)).toEqual([2, 3, 1]);
    });

    it('data should be sorted by name ascending and last name descending', () => {
        const orders = ['asc', 'desc'];

        expect(sortDataAndGetIds(orders, extractor)).toEqual([1, 2, 3]);
    });

    it('data should be sorted by name descending and last name ascending', () => {
        const orders = ['desc', 'asc'];

        expect(sortDataAndGetIds(orders, extractor)).toEqual([3, 2, 1]);
    });
});