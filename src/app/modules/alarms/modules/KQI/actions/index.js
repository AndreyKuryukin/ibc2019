import _ from 'lodash';

export const FETCH_KQI_HISTORY_SUCCESS = 'alarms/FETCH_KQI_HISTORY_SUCCESS';
export const fetchHistorySuccess = history => ({
    type: FETCH_KQI_HISTORY_SUCCESS,
    payload: { history },
});

const createFilterAction = (type, property) => value => ({
    type,
    payload: {
        [property]: value
    },
});

export const SET_FILTER_START = 'alarms/KQI/SET_FILTER_START';
export const SET_FILTER_END = 'alarms/KQI/SET_FILTER_END';
export const SET_FILTER_RF = 'alarms/KQI/SET_FILTER_RF';
export const SET_FILTER_MRF = 'alarms/KQI/SET_FILTER_MRF';
export const SET_FILTER_CURRENT = 'alarms/KQI/SET_FILTER_CURRENT';
export const SET_FILTER_HISTORICAL = 'alarms/KQI/SET_FILTER_HISTORICAL';

const FILTER_SETTERS = {
    START: createFilterAction(SET_FILTER_START, 'start'),
    END: createFilterAction(SET_FILTER_END, 'end'),
    RF: createFilterAction(SET_FILTER_RF, 'rf'),
    MRF: createFilterAction(SET_FILTER_MRF, 'mrf'),
    CURRENT: createFilterAction(SET_FILTER_CURRENT, 'current'),
    HISTORICAL: createFilterAction(SET_FILTER_HISTORICAL, 'historical'),
};

export const setFilterProperty = (property, value) => {
    const setter = FILTER_SETTERS[property.toUpperCase()];

    return _.isFunction(setter) ? setter(value) : null;
};
