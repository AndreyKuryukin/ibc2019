import {
    FETCH_PARAMETER_TYPES_SUCCESS,
    FETCH_CONFIG_SUCCESS
} from '../actions';

const initialState = {
    objectTypes: [],
    config: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_PARAMETER_TYPES_SUCCESS: {
            const objectTypes = action.payload.paramTypes;
            return {
                ...state,
                objectTypes
            };
        }
        case FETCH_CONFIG_SUCCESS: {
            return {
                ...state,
                config: action.payload.config
            };
        }
        default:
            return state;
    }
};
