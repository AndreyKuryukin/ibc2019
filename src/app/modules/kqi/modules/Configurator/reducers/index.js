import {
    FETCH_PARAMETER_TYPES_SUCCESS,
    FETCH_CONFIG_SUCCESS
} from '../actions';

const initialState = {
    paramTypes: [],
    paramTypesById: {},
    config: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_PARAMETER_TYPES_SUCCESS: {
            const paramTypesById = {};
            action.payload.paramTypes.forEach(type => {
                paramTypesById[type.id] = type;
            });

            return {
                ...state,
                paramTypes: action.payload.paramTypes,
                paramTypesById,
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
