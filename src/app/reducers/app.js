import { LANGUAGES } from '../costants/login';
import { SET_LANGUAGE } from '../actions';

const initialState = {
    language: LANGUAGES.RUSSIAN,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload.language,
            };
        default:
            return state;
    }
};
