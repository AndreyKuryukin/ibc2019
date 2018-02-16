import {
    FETCH_LIST_OF_ROLES_SUCCESS,
    CREATE_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE_SUCCESS,
} from '../actions';
import _ from 'lodash';

const initialState = {
    list: [],
    byId: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LIST_OF_ROLES_SUCCESS: {
            const byId = {};
            const list = [];
            action.payload.roles.forEach((role) => {
                byId[role.id] = role;
                list.push(role.id);
            });

            return {
                byId,
                list,
            };
        }

        case CREATE_ROLE: {
            const { role } = action.payload;
            const list = [...state.list, role.id];
            const byId = { ...state.byId, [role.id]: role };

            return {
                byId,
                list,
            };
        }
        case UPDATE_ROLE: {
            const { role } = action.payload;
            const byId = { ...state.byId, [role.id]: role };

            return {
                ...state,
                byId,
            };
        }
        case DELETE_ROLE_SUCCESS: {
            const ids = action.payload.ids;
            const byId = _.omit(state.byId, ids);
            const list = _.without(state.list, ...ids);

            return {
                byId,
                list,
            };
        }
        default:
            return state;
    }
};
