import axios from 'axios';
import _ from 'lodash';
import { LOGIN_REQUEST, LOGIN_SUCCESS_RESPONSE, SIGN_IN_URL } from '../costants/login';

axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');

export const request = (url, params) => new Promise((resolve, reject) => {
    axios({ ...params, baseURL: window.location.origin, url })
        .then(response => resolve({ data: _.get(response, 'data'), headers: _.get(response, 'headers') }))
        .catch((error) => {
            const response = _.get(error, 'response');
            reject(response);

        });
});


export const signIn = (login, password) => request(SIGN_IN_URL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    data: {
        [LOGIN_REQUEST.LOGIN]: login,
        [LOGIN_REQUEST.PASSWORD]: password,
    },
}).then((response) => {
    const token = response.headers[LOGIN_SUCCESS_RESPONSE.AUTH];
    const userName = response.data[LOGIN_SUCCESS_RESPONSE.USER_NAME];
    localStorage.setItem('jwtToken', token);
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    return userName;
});



export const composeUrl = (url, params = {}) =>
    _.reduce(params, (result, value, key) => result.replace(`:${key}`, value), url);

export default {
    get: (url, params = {}, config = {}) => request(composeUrl(url, params.urlParams), {
        method: 'GET',
        params: config.queryParams,
    }),
    put: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {
        method: 'PUT',
        data,
        params: config.queryParams,
    }),
    post: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {
        method: 'POST',
        data,
        params: config.queryParams,
    }),
    delete: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {
        method: 'DELETE',
        data,
        params: config.queryParams,
    }),
};
