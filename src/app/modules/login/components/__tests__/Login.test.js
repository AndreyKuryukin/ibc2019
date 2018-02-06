import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Login from '../index';

configure({ adapter: new Adapter() });

describe('Login', () => {
    const onSubmit = jest.fn();

    const params = {
        onSubmit,
        login: 'Test',
        password: 'TestPasswd'
    };
    const login = mount(
        <Login
            {...params}
        />);

    test('Should render', () => {
        expect(login.exists()).toBeTruthy();
    });

    test('Shouldnt call onSubmit', () => {
        login.find('Button[type="submit"]').simulate('submit');
        login.update();
        expect(onSubmit.mock.calls).toEqual([[{
            login: 'Test',
            password: 'TestPasswd'
        }]]);
    });

    test('Should have login', () => {
        expect(login.find('Input[name="login"]').props().value).toEqual('Test')
    });

    test('Should have password', () => {
        expect(login.find('Input[name="password"]').props().value).toEqual('TestPasswd')
    });


});