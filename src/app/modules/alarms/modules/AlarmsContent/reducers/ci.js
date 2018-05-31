import moment from 'moment';
import {
    SET_CI_FILTER_START,
    SET_CI_FILTER_END,
    SET_CI_FILTER_RF,
    SET_CI_FILTER_MRF,
    SET_CI_FILTER_CURRENT,
    SET_CI_FILTER_HISTORICAL,
} from '../actions';
import { FILTER_FIELDS } from '../constants';

const initialState = {
    filter: {
        [FILTER_FIELDS.START]: moment().subtract(1, 'weeks').toDate(),
        [FILTER_FIELDS.END]: moment().toDate(),
        [FILTER_FIELDS.RF]: '',
        [FILTER_FIELDS.MRF]: '',
        [FILTER_FIELDS.CURRENT]: false,
        [FILTER_FIELDS.HISTORICAL]: false,
    },
};

const createFilterReducer = property => (state, action) => ({
    ...state,
    filter: {
        ...state.filter,
        [property]: action.payload[property],
    },
});
const filterStartReducer = createFilterReducer(FILTER_FIELDS.START);
const filterEndReducer = createFilterReducer(FILTER_FIELDS.END);
const filterRfReducer = createFilterReducer(FILTER_FIELDS.RF);
const filterMrfReducer = createFilterReducer(FILTER_FIELDS.MRF);
const filterCurrentReducer = createFilterReducer(FILTER_FIELDS.CURRENT);
const filterHistoricalReducer = createFilterReducer(FILTER_FIELDS.HISTORICAL);

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CI_FILTER_START:
            return filterStartReducer(state, action);
        case SET_CI_FILTER_END:
            return filterEndReducer(state, action);
        case SET_CI_FILTER_RF:
            return filterRfReducer(state, action);
        case SET_CI_FILTER_MRF:
            return filterMrfReducer(state, action);
        case SET_CI_FILTER_CURRENT:
            return filterCurrentReducer(state, action);
        case SET_CI_FILTER_HISTORICAL:
            return filterHistoricalReducer(state, action);
        default:
            return state;
    }
};
