import rest from '../../rest';
import * as _ from "lodash";

export function search({serviceId, san, nls, mac}, mrf) {
    return rest.get('/api/v1/subscribers', {}, {
        queryParams: {
            serviceId,
            san,
            nls,
            mac,
            mrf,
        },
    }).then(response => response.data);
}
// Adapter requests
const createAdapterRequest = url => queryParams => rest.get(url, {}, { queryParams }).then(response => response.data);

export const argusKTPSearch = createAdapterRequest('/api/v1/subscribers');
export const technoGradSearch = createAdapterRequest('/api/v1/subscribers');
export const asrzSearch = createAdapterRequest('/api/v1/subscribers');

export function alert(id) {
    return rest.get(`/api/v1/alerts/${id}`).then(response => response.data);
}
export function alerts(subscriber, {startDate, endDate, devices, limit}) {
    return rest.post('/api/v1/subscribers/alerts', subscriber, {
        queryParams: {
            startDate,
            endDate,
            devices: devices.join(','),
            limit,
        },
    }).then(response => response.data);
}

const currentTopologyRequests = new WeakMap();
export function topology(subscriber) {
    const currentRequest = currentTopologyRequests.get(subscriber);
    if (currentRequest !== undefined) return currentRequest;

    const request = rest.post('/api/v1/subscribers/topology', subscriber)
        .then(response => {
            try {
                return {
                    ...response.data,
                    subscriber_devices: response.data.subscriber_devices.map(device => ({
                        ...device,
                        mac_address: typeof device.mac_address === 'string'
                            ? device.mac_address.replace(/\W/g, '')
                            : device.mac_address,
                    })),
                };
            } catch (e) {
                return response.data;
            }
        });
    currentTopologyRequests.set(subscriber, request);
    return request;
}

export function parameterTypes() {
    return rest.get('/api/v1/common/subscriber/metrics').then(response => response.data);
}

export async function metrics({serviceId, affilateId, paramsKeys, hoursLimit, mac}) {
    const paramTypes = await parameterTypes();
    const parameters =_.get(paramTypes, 'parameters', []);
    const paramKeys = parameters.map(parameter => parameter.name);
    return rest.get('/api/v1/subscribers/stb/aggregated', {}, {
        queryParams: {
            serviceId,
            affilateId,
            paramsKeys: paramKeys.join(','),
            hoursLimit,
            mac,
        },
    }).then(response => ({ metrics: response.data, parameters }));
}

export function devicesKQI({serviceId, affilateId, periodUnit}) {
    return rest.get('/kqi/v1/online/kabs/devices', {}, {
        queryParams: {
            serviceId,
            affilateId,
            periodUnit,
        },
    }).then(response => response.data);
}

export function macKQI({macs, periodUnit}) {
    return rest.get('/kqi/v1/online/kabs/macs', {} , {
        queryParams: {
            macs: macs.join(','),
            periodUnit,
        },
    }).then(response => response.data);
}
