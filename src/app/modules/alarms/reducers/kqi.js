import moment from 'moment';
import {
    SET_KQI_FILTER,
} from '../actions';
import { FILTER_FIELDS } from '../constants';

const initialState = {
    [FILTER_FIELDS.START]: moment().subtract(1, 'weeks').toDate(),
    [FILTER_FIELDS.END]: moment().toDate(),
    [FILTER_FIELDS.RF]: '',
    [FILTER_FIELDS.MRF]: '',
    [FILTER_FIELDS.CURRENT]: false,
    [FILTER_FIELDS.HISTORICAL]: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_KQI_FILTER:
            return action.payload.filter;
        default:
            return state;
    }
};