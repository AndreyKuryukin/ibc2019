import _ from 'lodash';
import { FETCH_ALERTS_SUCCESS, READ_NEW_ALERT } from '../actions';

const initialState = {
    alerts: [],
    total: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALERTS_SUCCESS:
            return {
                ...state,
                alerts: _.isArray(action.payload.alerts.alerts) ? action.payload.alerts.alerts : [],
                total: action.payload.alerts.total,
            };
        case READ_NEW_ALERT:
            return {
                ...state,
                alerts: state.alerts.map(alert => alert.id === action.payload.id ? { ...alert, new: false, } : alert),
            };
        default:
            return state;
    }
};