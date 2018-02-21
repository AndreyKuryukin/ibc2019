import {
    FETCH_USERS_SUCCESS,
} from '../actions';

const initialState = {
    list: [],
    byId: {},
};

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
                byId,
                list,
            };
        }
        default:
            return state;
    }
};
