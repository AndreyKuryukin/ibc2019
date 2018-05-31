import _ from 'lodash';
import moment from 'moment';
import {
    FETCH_KQI_HISTORY_SUCCESS,
    SET_FILTER_START,
    SET_FILTER_END,
    SET_FILTER_RF,
    SET_FILTER_MRF,
    SET_FILTER_CURRENT,
    SET_FILTER_HISTORICAL,
} from '../actions';

const initialState = {
    history: [],
    filter: {
        start: moment().subtract(1, 'weeks').toDate(),
        end: moment().toDate(),
        rf: '',
        mrf: '',
        current: false,
        historical: false,
    },
};

const createFilterReducer = property => (state, action) => ({
    ...state,
    filter: {
        ...state.filter,
        [property]: action.payload[property],
    }
});
const filterStartReducer = createFilterReducer('start');
const filterEndReducer = createFilterReducer('end');
const filterRfReducer = createFilterReducer('rf');
const filterMrfReducer = createFilterReducer('mrf');
const filterCurrentReducer = createFilterReducer('current');
const filterHistoricalReducer = createFilterReducer('historical');

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_KQI_HISTORY_SUCCESS:
            return {
                ...state,
                history: _.isArray(action.payload.history) ? action.payload.history : [],
            };
        case SET_FILTER_START:
            return filterStartReducer(state, action);
        case SET_FILTER_END:
            return filterEndReducer(state, action);
        case SET_FILTER_RF:
            return filterRfReducer(state, action);
        case SET_FILTER_MRF:
            return filterMrfReducer(state, action);
        case SET_FILTER_CURRENT:
            return filterCurrentReducer(state, action);
        case SET_FILTER_HISTORICAL:
            return filterHistoricalReducer(state, action);
        default:
            return state;
    }
};
