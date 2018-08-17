import _ from 'lodash';
import { FETCH_ALERTS_SUCCESS } from '../actions';

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
        default:
            return state;
    }
};