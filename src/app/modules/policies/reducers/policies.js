import { FETCH_POLICIES_SUCCESS } from '../actions';

const initialState = {
    list: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_POLICIES_SUCCESS:
            return {
                list: Array.isArray(action.payload.policies) ? action.payload.policies : [],
            };
        default:
            return state;
    }
};
