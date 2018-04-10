import _ from 'lodash';
import { validateForm } from '../validation';

describe('validation', () => {
    const FORMS = {
        FILLED: {
            name: 'Name 1',
            surname: 'Surname 1',
            age: '20',
            address: {
                city: 'City',
                street: 'Street',
            },
            children: [{ name: 'Name 2' }],
        },
        EMPTY: {
            name: '',
            surname: '',
            age: '',
            address: {
                city: '',
                street: '',
            },
            children: [],
        },
    };

    const config = {
        name: {
            required: true,
        },
        surname: {
            required: true,
        },
        age: {
            required: true,
        },
        address: () => ({
            city: {
                required: true,
            },
            street: {
                required: true,
            },
        }),
        children: [{
            notEmpty: true,
        },
        {
            name: {
                required: true,
            },
        }]
    };

    it('filled form validation', () => {
        expect(_.keys(validateForm(FORMS.FILLED, config)).length).toBe(0);
    });

    it('empty form validation', () => {
        expect(_.keys(validateForm(FORMS.EMPTY, config)).length).toBe(_.keys(config).length);
    });
});
