import { FETCH_USER_SUCCESS, FETCH_ROLES_SUCCESS, FETCH_GROUPS_SUCCESS } from '../actions';

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
        default:
            return state;
    }
};
