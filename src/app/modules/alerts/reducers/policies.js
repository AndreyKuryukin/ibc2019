import _ from 'lodash';
import { FETCH_POLICIES_SUCCESS } from '../actions';

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_POLICIES_SUCCESS:
            return _.isArray(action.payload.policies) ? action.payload.policies : [];
        default:
            return state;
    }
};