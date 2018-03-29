import {
    FETCH_REPORTS_SUCCESS
} from '../actions';

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_REPORTS_SUCCESS:
            return action.payload.reports;
        default:
            return state;
    }
};