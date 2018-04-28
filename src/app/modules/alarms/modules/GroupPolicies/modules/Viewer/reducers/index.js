import { FETCH_ALARM_SUCCESS } from '../actions';

export default (state = null, action) => {
    switch (action.type) {
        case FETCH_ALARM_SUCCESS:
            return action.payload.alarm;
        default:
            return state;
    }
};
