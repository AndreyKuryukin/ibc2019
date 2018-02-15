import axios from 'axios';
import _ from 'lodash';
import { LOGIN_REQUEST, LOGIN_SUCCESS_RESPONSE, SIGN_IN_URL } from "../costants/login";

export const request = (url, params) => new Promise((resolve, reject) => {
    axios({ ...params, url })
        .then(response => resolve({ data: _.get(response, 'data') }))
        .catch(error => {
            const errors = _.get(error, 'response.data.errors');
            const errCode = _.get(error, 'response.status');
            if (errCode === 400 && errors) {
                resolve(_.get(error, 'response.data'))
            } else {
                // todo: handle different kinds of errors
                reject();
            }
        })
});


export const signIn = (login, password) => {
    return request(SIGN_IN_URL, {
        method: 'POST',
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        data: {
            [LOGIN_REQUEST.LOGIN]: login,
            [LOGIN_REQUEST.PASSWORD]: password
        }
    }).then((response) => {
        const token = response.data[LOGIN_SUCCESS_RESPONSE.TOKEN];
        const userName = response.data[LOGIN_SUCCESS_RESPONSE.USER_NAME];
        localStorage.setItem('jwtToken', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        return userName
    })
};


export const composeUrl = (url, params = {}) =>
    _.reduce(params, (result, value, key) => result.replace(`:${key}`, value), url);

export default {
    get: (url, params) => request(composeUrl(url, params.urlParams), {
        method: 'GET',
        params: config.queryParams
    }),
    put: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {
        method: 'PUT',
        data,
        params: config.queryParams
    }),
    post: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {
        method: 'POST',
        data,
        params: config.queryParams
    }),
    delete: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {
        method: 'DELETE',
        data,
        params: config.queryParams
    }),
}
