import _ from 'lodash';
import { FETCH_ALARMS_SUCCESS } from '../actions';

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_ALARMS_SUCCESS:
            return _.isArray(action.payload.alarms) ? action.payload.alarms : [];
        default:
            return state;
    }
};