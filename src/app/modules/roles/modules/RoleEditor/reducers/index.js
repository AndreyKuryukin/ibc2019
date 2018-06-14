import { FETCH_ROLE_SUCCESS, FETCH_SUBJECTS_SUCCESS, RESET_ROLES_EDITOR, FETCH_ACCESS_LEVEL_TYPES_SUCCESS } from '../actions';

const initialState = {
    role: {
        name: '',
        description: '',
        access_level: [],
    },
    subjects: [],
    access_level_types: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ROLE_SUCCESS:
            return {
                ...state,
                role: {
                    ...state.role,
                    ...action.payload.role,
                },
            };
        case FETCH_SUBJECTS_SUCCESS:
            return {
                ...state,
                subjects: action.payload.subjects,
            };
        case FETCH_ACCESS_LEVEL_TYPES_SUCCESS: {
            return {
                ...state,
                access_level_types: action.payload.types,
            };
        }
        case RESET_ROLES_EDITOR:
            return {
                ...state,
                role: initialState.role,
            };
        default:
            return state;
    }
};
