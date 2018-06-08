import { FETCH_ADAPTERS_SUCCESS, FETCH_NOTIFICATIONS_SUCCESS } from '../actions';

const initialState = {
    adapters: [],
    notifications: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADAPTERS_SUCCESS:
            return {
                ...state,
                adapters: action.payload.adapters,
            };
        case FETCH_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                notifications: action.payload.notifications,
            };
        default:
            return state;
    }
};
