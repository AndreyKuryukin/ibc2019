import _ from 'lodash';
import { FETCH_POLICIES_SUCCESS } from '../actions';
import { CREATE_POLICY, UPDATE_POLICY } from '../modules/PolicyEditor/actions';

const initialState = {
    list: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_POLICIES_SUCCESS:
            return {
                list: [...action.payload.policies],
            };
        case CREATE_POLICY: {
            const { policy } = action.payload;
            const list = [...state.list, policy];

            return {
                list,
            };
        }
        case UPDATE_POLICY: {
            const { id } = action.payload.policy;
            const list = [
                ...state.list.filter(policy => policy.id !== id),
                action.payload.policy,
            ];

            return {
                list,
            };
        }
        default:
            return state;
    }
};
