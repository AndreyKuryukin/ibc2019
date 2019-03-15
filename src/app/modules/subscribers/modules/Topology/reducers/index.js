import {RESET_SEARCH_RESULTS} from '../../Search/reducers';

const initialState = {
    subscriber: null,
    topology: null,
    isLoading: false,
};


const FETCH_TOPOLOGY = 'subscribers/FETCH_TOPOLOGY';
export function fetchTopology() {
    return {type: FETCH_TOPOLOGY};
}
const FETCH_TOPOLOGY_SUCCESS = 'subscribers/FETCH_TOPOLOGY_SUCCESS';
export function fetchTopologySuccess(topology) {
    return {
        type: FETCH_TOPOLOGY_SUCCESS,
        payload: {
            subscriber: topology.subscriber_devices,
            topology: topology.topology_devices,
        },
    };
}
const FETCH_TOPOLOGY_ERROR = 'subscribers/FETCH_TOPOLOGY_ERROR';
export function fetchTopologyError() {
    return {type: FETCH_TOPOLOGY_ERROR};
}


export function selectSubscriberDevices(state) {
    return state.subscribers.topology.subscriber;
}
export function selectTopologyDevices(state) {
    return state.subscribers.topology.topology;
}
export function selectSubscriberMacs(state) {
    const devices = selectSubscriberDevices(state);
    if (devices === null) return [];
    return devices.map(device => device.mac_address);
}
export function selectSubscriberTechnology(state) {
    const devices = selectSubscriberDevices(state);

    if (devices === null) return null;

    const device = devices.find(d => d.network_type !== undefined);
    if (device === undefined) return '-';

    return device.network_type;
}
export function selectTopologyCommutator(state) {
    const devices = selectTopologyDevices(state);

    if (devices === null) return null;

    const device = devices.find(d => d.sqm_device_type === 'ACC');
    if (device === undefined) return '-';

    return [device.device_name, device.ip].join(', ')
        + ` (${[device.device_vendor, device.device_model].join(' ')})`;
}
export function selectIsTopologyLoading(state) {
    return state.subscribers.topology.isLoading;
}

export default function topologyReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TOPOLOGY: return {
            ...state,
            subscriber: initialState.subscriber,
            topology: initialState.topology,
            isLoading: true,
        };
        case FETCH_TOPOLOGY_SUCCESS:
            return {
                ...state,
                subscriber: action.payload.subscriber,
                topology: action.payload.topology,
                isLoading: false,
            };
        case FETCH_TOPOLOGY_ERROR: return {...state, isLoading: false};
        case RESET_SEARCH_RESULTS: return initialState;
        default: return state;
    }
}
