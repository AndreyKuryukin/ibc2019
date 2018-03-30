import { FETCH_REPORTS_SUCCESS, REMOVE_RESULT } from '../actions';



export default (state = [], action) => {
    switch (action.type) {
        case FETCH_REPORTS_SUCCESS:
            return action.payload.reports;
        case REMOVE_RESULT:

            return [...state];
        default:
            return state;
    }
};