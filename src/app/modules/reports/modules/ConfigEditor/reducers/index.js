import { FETCH_USERS_SUCCESS, FETCH_TEMPLATES_SUCCESS } from '../actions';

const initialState = {
    users: [],
    templates: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload.users.filter(user => !!user.email),
            };
        }
        case FETCH_TEMPLATES_SUCCESS: {
            return {
                ...state,
                templates: action.payload.templates,
            };
        }
        default:
            return state;
    }
};