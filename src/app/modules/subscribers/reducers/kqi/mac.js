import get from 'lodash/get';
import {RESET_SEARCH_RESULTS} from '../../modules/Search/reducers';
import {normalize} from './util';

const initialState = {
    byId: {},
    list: [],
    isLoading: false,
};

const FETCH_MAC_KQI = 'subscribers/kqi/mac/FETCH';
export function fetchMacKQI() {
    return {type: FETCH_MAC_KQI};
}
const FETCH_MAC_KQI_SUCCESS = 'subscribers/kqi/mac/FETCH_SUCCESS';
export function fetchMacKQISuccess(kqi) {
    const current = get(kqi, 'current');
    const previous = get(kqi, 'previous');
    if (!Array.isArray(current)) {
        console.warn('Invalid kqi data received:', kqi);
    }
    const payload = {
        kqi: {
            current: current || [],
            previous: previous || [],
        },
    };
    return {type: FETCH_MAC_KQI_SUCCESS, payload};
}
const FETCH_MAC_KQI_ERROR = 'subscribers/kqi/mac/FETCH_ERROR';
export function fetchMacKQIError() {
    return {type: FETCH_MAC_KQI_ERROR};
}


export function selectKQIMap(state) {
    return state.subscribers.kqi.mac.byId;
}

export function isMacKQILoading(state) {
    return state.subscribers.kqi.mac.isLoading;
}


export default function macKQIReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_MAC_KQI: return {
            ...state,
            byId: initialState.byId,
            list: initialState.list,
            isLoading: true,
        };
        case FETCH_MAC_KQI_SUCCESS: {
            const {byId, list} = normalize(action.payload.kqi);

            return {
                ...state,
                byId,
                list,
                isLoading: false,
            };
        }
        case FETCH_MAC_KQI_ERROR: return {...state, isLoading: false};
        case RESET_SEARCH_RESULTS: return initialState;
        default: return state;
    }
}
