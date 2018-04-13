import search from '../search';

describe('searching', () => {
    const str = 'test_string';

    it('search existing part of string', () => {
        expect(search(str, 'test')).toBeTruthy();
    });

    it('search not existing part of string', () => {
        expect(search(str, '123')).toBeFalsy();
    });

    it('search not in string', () => {
        expect(search(null, '123')).toBeFalsy();
    });
});
