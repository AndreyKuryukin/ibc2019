import _ from 'lodash';
import {
    GROUP_POLICIES_ALARMS,
    CLIENTS_INCIDENTS_ALARMS,
    KQI_ALARMS,
    FILTER_FIELDS,
} from '../constants';

export const FETCH_ALARMS_SUCCESS = 'alarms/FETCH_ALARMS_SUCCESS';
export const fetchAlarmsSuccess = alarms => ({
    type: FETCH_ALARMS_SUCCESS,
    payload: { alarms },
});

export const SET_GP_FILTER_START = 'alarms/gp/SET_FILTER_START';
export const SET_GP_FILTER_END = 'alarms/gp/SET_FILTER_END';
export const SET_GP_FILTER_RF = 'alarms/gp/SET_FILTER_RF';
export const SET_GP_FILTER_MRF = 'alarms/gp/SET_FILTER_MRF';
export const SET_GP_FILTER_CURRENT = 'alarms/gp/SET_FILTER_CURRENT';
export const SET_GP_FILTER_HISTORICAL = 'alarms/gp/SET_FILTER_HISTORICAL';

export const SET_CI_FILTER_START = 'alarms/clients-incidents/SET_FILTER_START';
export const SET_CI_FILTER_END = 'alarms/clients-incidents/SET_FILTER_END';
export const SET_CI_FILTER_RF = 'alarms/clients-incidents/SET_FILTER_RF';
export const SET_CI_FILTER_MRF = 'alarms/clients-incidents/SET_FILTER_MRF';
export const SET_CI_FILTER_CURRENT = 'alarms/clients-incidents/SET_FILTER_CURRENT';
export const SET_CI_FILTER_HISTORICAL = 'alarms/clients-incidents/SET_FILTER_HISTORICAL';

export const SET_KQI_FILTER_START = 'alarms/KQI/SET_FILTER_START';
export const SET_KQI_FILTER_END = 'alarms/KQI/SET_FILTER_END';
export const SET_KQI_FILTER_RF = 'alarms/KQI/SET_FILTER_RF';
export const SET_KQI_FILTER_MRF = 'alarms/KQI/SET_FILTER_MRF';
export const SET_KQI_FILTER_CURRENT = 'alarms/KQI/SET_FILTER_CURRENT';
export const SET_KQI_FILTER_HISTORICAL = 'alarms/KQI/SET_FILTER_HISTORICAL';

const createFilterSetter = (type, property) => value => ({
    type,
    payload: {
        [property]: value,
    },
});

const FILTER_SETTERS = {
    [GROUP_POLICIES_ALARMS]: {
        [FILTER_FIELDS.START]: createFilterSetter(SET_GP_FILTER_START, FILTER_FIELDS.START),
        [FILTER_FIELDS.END]: createFilterSetter(SET_GP_FILTER_END, FILTER_FIELDS.END),
        [FILTER_FIELDS.RF]: createFilterSetter(SET_GP_FILTER_RF, FILTER_FIELDS.RF),
        [FILTER_FIELDS.MRF]: createFilterSetter(SET_GP_FILTER_MRF, FILTER_FIELDS.MRF),
        [FILTER_FIELDS.CURRENT]: createFilterSetter(SET_GP_FILTER_CURRENT, FILTER_FIELDS.CURRENT),
        [FILTER_FIELDS.HISTORICAL]: createFilterSetter(SET_GP_FILTER_HISTORICAL, FILTER_FIELDS.HISTORICAL),
    },
    [CLIENTS_INCIDENTS_ALARMS]: {
        [FILTER_FIELDS.START]: createFilterSetter(SET_CI_FILTER_START, FILTER_FIELDS.START),
        [FILTER_FIELDS.END]: createFilterSetter(SET_CI_FILTER_END, FILTER_FIELDS.END),
        [FILTER_FIELDS.RF]: createFilterSetter(SET_CI_FILTER_RF, FILTER_FIELDS.RF),
        [FILTER_FIELDS.MRF]: createFilterSetter(SET_CI_FILTER_MRF, FILTER_FIELDS.MRF),
        [FILTER_FIELDS.CURRENT]: createFilterSetter(SET_CI_FILTER_CURRENT, FILTER_FIELDS.CURRENT),
        [FILTER_FIELDS.HISTORICAL]: createFilterSetter(SET_CI_FILTER_HISTORICAL, FILTER_FIELDS.HISTORICAL),
    },
    [KQI_ALARMS]: {
        [FILTER_FIELDS.START]: createFilterSetter(SET_KQI_FILTER_START, FILTER_FIELDS.START),
        [FILTER_FIELDS.END]: createFilterSetter(SET_KQI_FILTER_END, FILTER_FIELDS.END),
        [FILTER_FIELDS.RF]: createFilterSetter(SET_KQI_FILTER_RF, FILTER_FIELDS.RF),
        [FILTER_FIELDS.MRF]: createFilterSetter(SET_KQI_FILTER_MRF, FILTER_FIELDS.MRF),
        [FILTER_FIELDS.CURRENT]: createFilterSetter(SET_KQI_FILTER_CURRENT, FILTER_FIELDS.CURRENT),
        [FILTER_FIELDS.HISTORICAL]: createFilterSetter(SET_KQI_FILTER_HISTORICAL, FILTER_FIELDS.HISTORICAL),
    },
};

const createFilterAction = type => (property, value) => {
    const setter = _.get(FILTER_SETTERS, `${type}.${property}`);

    return _.isFunction(setter) ? setter(value) : null;
};

export const FILTER_ACTIONS = {
    [GROUP_POLICIES_ALARMS]: createFilterAction(GROUP_POLICIES_ALARMS),
    [CLIENTS_INCIDENTS_ALARMS]: createFilterAction(CLIENTS_INCIDENTS_ALARMS),
    [KQI_ALARMS]: createFilterAction(KQI_ALARMS),
};


