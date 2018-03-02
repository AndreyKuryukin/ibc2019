import _ from 'lodash';
import { FETCH_POLICIES_SUCCESS } from '../actions';

const initialState = {
    list: [],
    byId: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_POLICIES_SUCCESS: {
            const byId = {};
            const list = [];
            action.payload.policies.forEach((policy) => {
                byId[policy.id] = policy;
                list.push(policy.id);
            });
            console.log(byId);
            return {
                byId,
                list,
            };
        }
        default:
            return state;
    }
};
