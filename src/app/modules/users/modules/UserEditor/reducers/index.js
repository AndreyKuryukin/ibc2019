import { FETCH_GROUPS_SUCCESS, FETCH_ROLES_SUCCESS, FETCH_USER_SUCCESS, RESET_USER } from '../actions';

const initialState = {
    user: {
        password: '',
        confirm: '',
        login: '',
        phone: '',
        description: '',
        disabled: true,
        first_name: '',
        last_name: '',
        ldap_auth: false,
        notify_language: '',
    },
    roles: [],
    groups: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload.user,
                    roles: action.payload.user.roles.map(role => role.id),
                    groups: action.payload.user.groups.map(group => group.id),
                },
            };
        case FETCH_ROLES_SUCCESS:
            return {
                ...state,
                roles: action.payload.roles,
            };
        case FETCH_GROUPS_SUCCESS:
            return {
                ...state,
                groups: action.payload.groups,
            };
        case RESET_USER:
            return {
                ...state,
                user: initialState.user,
            };
        default:
            return state;
    }
};
