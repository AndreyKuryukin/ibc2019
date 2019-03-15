import get from 'lodash/get';
import {RESET_SEARCH_RESULTS} from '../../modules/Search/reducers';
import {normalize} from './util';

const initialState = {
    devices: {
        byId: {},
        list: [],
    },
    stbs: {
        byId: {},
        list: [],
    },
    isLoading: false,
};

const FETCH_DEVICES_KQI = 'subscribers/kqi/devices/FETCH';
export function fetchDevicesKQI() {
    return {type: FETCH_DEVICES_KQI};
}
const FETCH_DEVICES_KQI_SUCCESS = 'subscribers/kqi/devices/FETCH_SUCCESS';
export function fetchDevicesKQISuccess(kqi) {
    const currentDevices = get(kqi, 'current.devices');
    if (!Array.isArray(currentDevices)) {
        console.warn('Invalid kqi data received:', kqi);
    }
    const payload = {
        kqi: {
            current: {
                devices: currentDevices || [],
                stbs: get(kqi, 'current.stbs', []),
            },
            previous: {
                devices: get(kqi, 'previous.devices', []),
                stbs: get(kqi, 'previous.stbs', []),
            },
        },
    };
    return {type: FETCH_DEVICES_KQI_SUCCESS, payload};
}
const FETCH_DEVICES_KQI_ERROR = 'subscribers/kqi/devices/FETCH_ERROR';
export function fetchDevicesKQIError() {
    return {type: FETCH_DEVICES_KQI_ERROR};
}


export function selectDevicesKQIMap(state) {
    return state.subscribers.kqi.devices.devices.byId;
}
export function selectSTBSKQIMap(state) {
    return state.subscribers.kqi.devices.stbs.byId;
}

export function selectDevicesKQILoading(state) {
    return state.subscribers.kqi.devices.isLoading;
}


export default function devicesKQIReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_DEVICES_KQI: return {
            ...state,
            devices: initialState.devices,
            stbs: initialState.stbs,
            isLoading: true,
        };
        case FETCH_DEVICES_KQI_SUCCESS: {
            return {
                ...state,
                devices: normalize({
                    current: action.payload.kqi.current.devices,
                    previous: action.payload.kqi.previous.devices,
                }),
                stbs: normalize({
                    current: action.payload.kqi.current.stbs,
                    previous: action.payload.kqi.previous.stbs,
                }),
                isLoading: false,
            };
        }
        case FETCH_DEVICES_KQI_ERROR: return {...state, isLoading: false};
        case RESET_SEARCH_RESULTS: return initialState;
        default: return state;
    }
}
