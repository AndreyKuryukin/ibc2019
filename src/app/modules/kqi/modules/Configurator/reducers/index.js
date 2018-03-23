import {
    FETCH_PARAMETER_TYPES_SUCCESS,
} from '../actions';

const initialState = {
    paramTypes: [],
    paramTypesById: {},
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
        default:
            return state;
    }
};
