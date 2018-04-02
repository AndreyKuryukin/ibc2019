import { FETCH_USERS_SUCCESS } from '../actions';

const initialState = {
    users: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload.users.filter(user => !!user.email),
            };
        }
        default:
            return state;
    }
};