import axios from 'axios';
import _ from 'lodash';

const request = (url, params) => new Promise((resolve, reject) => {
    axios({ ...params, url })
        .then(response => resolve({data: _.get(response, 'data')}))
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

export const composeUrl = (url, params = {}) =>
    _.reduce(params, (result, value, key) => result.replace(`:${key}`, value), url);

export default {
    get: (url, params, config = {}) => request(composeUrl(url, params.urlParams), {method: 'GET', params: config.queryParams}),
    put: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {method: 'PUT', data, params: config.queryParams}),
    post: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {method: 'POST', data, params: config.queryParams}),
    delete: (url, data, config = {}) => request(composeUrl(url, config.urlParams), {method: 'DELETE', data, params: config.queryParams}),
}
