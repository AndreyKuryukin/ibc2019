import _ from 'lodash';
import { FETCH_LIST_OF_KQI_RESULTS_SUCCESS } from '../actions';

export default (state = [], action) => {
    switch(action.type) {
        case FETCH_LIST_OF_KQI_RESULTS_SUCCESS:
            return action.payload.kqi;
        default:
            return state;
    }
};
