import { FETCH_KQI_HISTORY_SUCCESS } from '../actions';

const initialState = [];

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_KQI_HISTORY_SUCCESS:
            return action.payload.history;
        default:
            return state;
    }
};
