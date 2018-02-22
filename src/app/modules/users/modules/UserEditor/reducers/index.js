import { FETCH_USER_SUCCESS, FETCH_ROLES_SUCCESS } from '../actions';

const initialState = {
    user: {
        email: '',
        login: '',
        phone: '',
        description: '',
        disabled: true,
        first_name: '',
        last_name: '',
        ldap_auth: true,
        notify_language: '',
    },
    roles: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload.user,
                },
            };
        }
        case FETCH_ROLES_SUCCESS: {
            return {
                ...state,
                roles: action.payload.roles,
            };
        }
        default:
            return state;
    }
};
