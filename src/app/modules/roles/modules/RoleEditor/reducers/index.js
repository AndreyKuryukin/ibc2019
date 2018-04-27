import { FETCH_ROLE_SUCCESS, FETCH_SUBJECTS_SUCCESS, RESET_ROLES_EDITOR } from '../actions';

const initialState = {
    role: {
        name: '',
        description: '',
        subjects: [],
    },
    subjects: [],
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
        case RESET_ROLES_EDITOR:
            return {
                ...state,
                role: initialState.role,
            };
        default:
            return state;
    }
};
