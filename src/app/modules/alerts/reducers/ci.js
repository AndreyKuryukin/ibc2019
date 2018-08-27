import moment from 'moment';
import _ from 'lodash';
import { FETCH_CI_ALERTS_SUCCESS, FLUSH_CI_HIGHLIGHT, SET_CI_FILTER, UNHIGHLIGHT_CI_ALERT } from '../actions/ci';
import { FILTER_FIELDS } from '../constants';
import { SUBMIT_CI_NOTIFICATIONS } from '../../page/actions';

const initialState = {
    filter: {
        [FILTER_FIELDS.AUTO_REFRESH]: false,
        [FILTER_FIELDS.START]: moment().subtract(1, 'hours').toDate(),
        [FILTER_FIELDS.END]: moment().toDate(),
        [FILTER_FIELDS.RF]: '',
        [FILTER_FIELDS.MRF]: '',
        [FILTER_FIELDS.FILTER]: '',
        [FILTER_FIELDS.CURRENT]: true,
        [FILTER_FIELDS.HISTORICAL]: false,
        [FILTER_FIELDS.TYPE]: 'SIMPLE'
    },
    alerts: [],
    highLight: [],
    total: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CI_FILTER:
            return { ...state, filter: action.payload.filter };
        case FETCH_CI_ALERTS_SUCCESS:
            return {
                ...state,
                alerts: _.isArray(action.payload.alerts.alerts) ? action.payload.alerts.alerts : [],
                total: action.payload.alerts.total,
            };
        case SUBMIT_CI_NOTIFICATIONS:
            const alerts = _.get(action, 'payload.notifications', []);
            return {
                ...initialState,
                highLight: alerts,
            };
        case FLUSH_CI_HIGHLIGHT:
            return {
                ...state,
                highLight: [],
            };

        case UNHIGHLIGHT_CI_ALERT:
            return {
                ...state,
                highLight: state.highLight.filter(alert => alert.id !== action.payload.id),
            };
        default:
            return state;
    }
};
