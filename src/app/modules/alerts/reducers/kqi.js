import moment from 'moment';
import _ from 'lodash';
import { FETCH_KQI_ALERTS_SUCCESS, FLUSH_KQI_HIGHLIGHT, SET_KQI_FILTER, UNHIGHLIGHT_KQI_ALERT } from '../actions/kqi';
import { FILTER_FIELDS } from '../constants';
import { SUBMIT_KQI_NOTIFICATIONS } from '../../page/actions';


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
        case SET_KQI_FILTER:
            return { ...state, filter: action.payload.filter };
        case FETCH_KQI_ALERTS_SUCCESS:
            return {
                ...state,
                alerts: _.isArray(action.payload.alerts.alerts) ? action.payload.alerts.alerts : [],
                total: action.payload.alerts.total,
            };
        case SUBMIT_KQI_NOTIFICATIONS:
            const alerts = _.get(action, 'payload.notifications', []);
            return {
                ...initialState,
                highLight: alerts,
            };
        case FLUSH_KQI_HIGHLIGHT:
            return {
                ...state,
                highLight: [],
            };

        case UNHIGHLIGHT_KQI_ALERT:
            return {
                ...state,
                highLight: state.highLight.filter(alert => alert.id !== action.payload.id),
            };
            return state;
        default:
            return state;
    }
};