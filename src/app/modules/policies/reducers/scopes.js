import { FETCH_SCOPES_SUCCESS } from '../actions';

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SCOPES_SUCCESS:
            return [...action.payload.scopes];
        default:
            return state;
    }
};
