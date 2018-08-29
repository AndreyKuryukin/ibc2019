import _ from 'lodash';
import { FETCH_MRF_SUCCESS } from '../actions';

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_MRF_SUCCESS:
            return _.isArray(action.payload.mrf) ? action.payload.mrf : [];
        default:
            return state;
    }
};