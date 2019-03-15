import moment from 'moment';
import {RESET_SEARCH_RESULTS} from '../../modules/Search/reducers';
import {RANGES, selectRange} from '../kqi/range';

const initialState = {
    alerts: [],
    isLoading: false,
};


const FETCH_START = 'subscribers/alerts/FETCH_START';
export function fetchStart() {
    return {type: FETCH_START};
}
const FETCH_SUCCESS = 'subscribers/alerts/FETCH_SUCCESS';
export function fetchSuccess(alerts) {
    return {type: FETCH_SUCCESS, payload: {alerts}};
}

const r = state => state.subscribers.pages.alerts;
export function selectRangeDates(state) {
    const range = selectRange(state);

    const endOfType = {
        [RANGES.HOUR]: 'minute',
        [RANGES.DAY]: 'hour',
        [RANGES.WEEK]: 'day',
    }[range];

    return {
        startDate: moment().startOf(endOfType).add(1, endOfType).subtract(1, range).valueOf(),
        endDate: moment().startOf(endOfType).add(1, endOfType).valueOf(),
    };
}
export function selectAlerts(state) {
    return r(state).alerts;
}
export function selectAlert(state, {id}) {
    return r(state).alerts.find(alert => alert.id === id) || null;
}

export function selectIsAlertsLoading(state) {
    return r(state).isLoading;
}

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_START: return {
            ...state,
            alerts: initialState.alerts,
            isLoading: true,
        };
        case FETCH_SUCCESS: return {
            ...state,
            alerts: action.payload.alerts,
            isLoading: false,
        };
        case RESET_SEARCH_RESULTS: return initialState;
        default: return state;
    }
}
