import axios from 'axios';
import _ from 'lodash';
import { LOGIN_REQUEST, LOGIN_SUCCESS_RESPONSE, SIGN_IN_URL } from '../costants/login';

const responseCodeHooks = {};

export const request = (url, params) => new Promise((resolve, reject) => {
    axios({ ...params, baseURL: window.location.origin, url })
        .then(response => {
            const status = _.get(response, 'status', '');
            responseCodeHooks[status] && responseCodeHooks[status](response);
            resolve({ data: _.get(response, 'data'), headers: _.get(response, 'headers') })
        })
        .catch((error) => {
            const response = _.get(error, 'response');
            const status = _.get(response, 'status', '');
            responseCodeHooks[status] && responseCodeHooks[status](response);
            reject(response);
        });
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
    onResponseCode: (errorCode, callback) => {
        responseCodeHooks[errorCode] = callback;
    },
    setCommonHeader: (name, value) => {
        // axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
        axios.defaults.headers.common[name] = value;
    }
};
