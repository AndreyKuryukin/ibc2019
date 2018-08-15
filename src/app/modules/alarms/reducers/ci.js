import moment from 'moment';
import { SET_CI_FILTER } from '../actions';
import { FILTER_FIELDS } from '../constants';

const initialState = {
    [FILTER_FIELDS.AUTO_REFRESH]: false,
    [FILTER_FIELDS.START]: moment().subtract(1, 'hours').toDate(),
    [FILTER_FIELDS.END]: moment().toDate(),
    [FILTER_FIELDS.RF]: '',
    [FILTER_FIELDS.MRF]: '',
    [FILTER_FIELDS.CURRENT]: true,
    [FILTER_FIELDS.HISTORICAL]: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CI_FILTER:
            return action.payload.filter;
        default:
            return state;
    }
};
