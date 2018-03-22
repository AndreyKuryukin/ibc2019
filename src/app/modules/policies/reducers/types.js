import { FETCH_TYPES_SUCCESS } from "../actions/index";

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TYPES_SUCCESS:
            return [...action.payload.types];
        default:
            return state;
    }
};
