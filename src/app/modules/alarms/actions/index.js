import _ from 'lodash';
import {
    GROUP_POLICIES_ALARMS,
    CLIENTS_INCIDENTS_ALARMS,
    KQI_ALARMS,
} from '../constants';

export const FETCH_MRF_SUCCESS = 'alarms/FETCH_MRF_SUCCESS';
export const fetchMrfSuccess = mrf => ({
    type: FETCH_MRF_SUCCESS,
    payload: { mrf },
});

export const FETCH_ALARMS_SUCCESS = 'alarms/FETCH_ALARMS_SUCCESS';
export const fetchAlarmsSuccess = alarms => ({
    type: FETCH_ALARMS_SUCCESS,
    payload: { alarms },
});

export const SET_GP_FILTER = 'alarms/gp/SET_FILTER';
export const fetchGpFilter = filter => ({
    type: SET_GP_FILTER,
    payload: { filter },
});
export const SET_CI_FILTER = 'alarms/clients-incidents/SET_FILTER';
export const fetchCiFilter = filter => ({
    type: SET_CI_FILTER,
    payload: { filter },
});
export const SET_KQI_FILTER = 'alarms/KQI/SET_FILTER';
export const fetchKqiFilter = filter => ({
    type: SET_KQI_FILTER,
    payload: { filter },
});

export const FILTER_ACTIONS = {
    [GROUP_POLICIES_ALARMS]: fetchGpFilter,
    [CLIENTS_INCIDENTS_ALARMS]: fetchCiFilter,
    [KQI_ALARMS]: fetchKqiFilter,
};
