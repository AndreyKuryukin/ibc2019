import { FETCH_ALERT_SUCCESS } from '../actions';

export default (state = null, action) => {
    switch (action.type) {
        case FETCH_ALERT_SUCCESS:
            return action.payload.alert;
        default:
            return state;
    }
};
