import _ from 'lodash';
import {
    FETCH_USERS_SUCCESS,
    DELETE_USER_SUCCESS,
    FETCH_DIVISIONS_SUCCESS,
} from '../actions';
import { CREATE_USER, UPDATE_USER } from '../modules/UserEditor/actions';

const initialState = {
    list: [],
    byId: {},
    divisions: {},
    divisionsById: {},
};

const reduceChildrenDivisions = children => children.reduce((result, next) => {
    return next.children && next.children.length > 0 ? { ...result, [next.id]: next, ...reduceChildrenDivisions(next.children) } : { ...result, [next.id]: next };
}, {});

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_SUCCESS: {
            const byId = {};
            const list = [];
            action.payload.users.forEach((user) => {
                byId[user.id] = user;
                list.push(user.id);
            });

            return {
                ...state,
                byId,
                list,
            };
        }
        case FETCH_DIVISIONS_SUCCESS: {
            const divisionsById = {
                [action.payload.divisions.id]: action.payload.divisions,
                ...reduceChildrenDivisions(action.payload.divisions.children),
            };

            return {
                ...state,
                divisions: action.payload.divisions,
                divisionsById,
            };
        }
        case CREATE_USER: {
            const { user } = action.payload;
            const list = [...state.list, user.id];
            const byId = { ...state.byId, [user.id]: user };

            return {
                ...state,
                byId,
                list,
            };
        }
        case UPDATE_USER: {
            const { user } = action.payload;
            const byId = { ...state.byId, [user.id]: user };

            return {
                ...state,
                byId,
            };
        }
        case DELETE_USER_SUCCESS: {
            const { ids } = action.payload;
            const byId = _.omit(state.byId, ids);
            const list = _.without(state.list, ...ids);

            return {
                ...state,
                byId,
                list,
            };
        }
        default:
            return state;
    }
};
