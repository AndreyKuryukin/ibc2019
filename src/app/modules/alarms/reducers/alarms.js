import _ from 'lodash';
import { FETCH_ALARMS_SUCCESS } from '../actions';

const initialState = {
    alarms: [],
    total: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALARMS_SUCCESS:
            return {
                ...state,
                alarms: _.isArray(action.payload.alarms.alarms) ? action.payload.alarms.alarms : [],
                total: action.payload.alarms.total,
            };
        default:
            return state;
    }
};