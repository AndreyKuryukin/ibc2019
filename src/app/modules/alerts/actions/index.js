import _ from 'lodash';
import {
    GROUP_POLICIES_ALERTS,
    CLIENTS_INCIDENTS_ALERTS,
    KQI_ALERTS,
} from '../constants';

export const FETCH_MRF_SUCCESS = 'alerts/FETCH_MRF_SUCCESS';
export const fetchMrfSuccess = mrf => ({
    type: FETCH_MRF_SUCCESS,
    payload: { mrf },
});

export const FETCH_ALERTS_SUCCESS = 'alerts/FETCH_ALERTS_SUCCESS';
export const fetchAlertsSuccess = alerts => ({
    type: FETCH_ALERTS_SUCCESS,
    payload: { alerts },
});

export const FETCH_POLICIES_SUCCESS = 'alerts/FETCH_POLICIES_SUCCESS';
export const fetchPoliciesSuccess = policies => ({
    type: FETCH_POLICIES_SUCCESS,
    payload: { policies },
});
export const SET_GP_FILTER = 'alerts/gp/SET_FILTER';
export const fetchGpFilter = filter => ({
    type: SET_GP_FILTER,
    payload: { filter },
});
export const SET_CI_FILTER = 'alerts/clients-incidents/SET_FILTER';
export const fetchCiFilter = filter => ({
    type: SET_CI_FILTER,
    payload: { filter },
});
export const SET_KQI_FILTER = 'alerts/KQI/SET_FILTER';
export const fetchKqiFilter = filter => ({
    type: SET_KQI_FILTER,
    payload: { filter },
});

export const FILTER_ACTIONS = {
    [GROUP_POLICIES_ALERTS]: fetchGpFilter,
    [CLIENTS_INCIDENTS_ALERTS]: fetchCiFilter,
    [KQI_ALERTS]: fetchKqiFilter,
};
