import { FETCH_SUBJECTS_SUCCESS } from '../actions/subjects';

const initialState = {
    role: {
        name: '',
        description: '',
        number: 0,
        source: '',
        subjects: [],
    },
    subjects: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SUBJECTS_SUCCESS: {
            return {
                ...state,
                subjects: action.payload.subjects,
            };
        }
        default:
            return state;
    }
}