import _ from 'lodash';

export const FETCH_ALARMS_SUCCESS = 'alarms/FETCH_ALARMS_SUCCESS';
export const fetchAlarmsSuccess = alarms => ({
    type: FETCH_ALARMS_SUCCESS,
    payload: { alarms },
});

export const FETCH_REGIONS_SUCCESS = 'alarms/FETCH_REGIONS_SUCCESS';
export const fetchRegionsSuccess = regions => ({
    type: FETCH_REGIONS_SUCCESS,
    payload: { regions },
});

export const FETCH_LOCATIONS_SUCCESS = 'alarms/FETCH_LOCATIONS_SUCCESS';
export const fetchLocationsSuccess = locations => ({
    type: FETCH_LOCATIONS_SUCCESS,
    payload: { locations },
});

const createFilterAction = (type, property) => value => ({
    type,
    payload: {
        [property]: value
    },
});

export const SET_FILTER_START = 'alarms/group-policies/SET_FILTER_START';
export const SET_FILTER_END = 'alarms/group-policies/SET_FILTER_END';
export const SET_FILTER_RF = 'alarms/group-policies/SET_FILTER_RF';
export const SET_FILTER_MRF = 'alarms/group-policies/SET_FILTER_MRF';
export const SET_FILTER_CURRENT = 'alarms/group-policies/SET_FILTER_CURRENT';
export const SET_FILTER_HISTORICAL = 'alarms/group-policies/SET_FILTER_HISTORICAL';

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