import { FETCH_SUCCESS } from "../actions/index";

const initialState = {
    list: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SUCCESS:
            return { ...state, list: action.payload.sources };
        default:
            return state;
    }
};