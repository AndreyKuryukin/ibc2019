import { FETCH_ALARMS_SUCCESS } from '../actions';

const initialState = {
    list: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALARMS_SUCCESS:
            return {
                list: Array.isArray(action.payload.alarms) ? action.payload.alarms : [],
            };
        default:
            return state;
    }
};
