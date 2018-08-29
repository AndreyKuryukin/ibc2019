import moment from 'moment';
import _ from 'lodash';
import {
    APPLY_GP_FILTER,
    FETCH_GP_ALERTS_SUCCESS,
    FLUSH_GP_HIGHLIGHT,
    SET_GP_FILTER,
    UNHIGHLIGHT_GP_ALERT
} from '../actions/gp';
import { FILTER_FIELDS, GROUP_POLICIES_ALERT_TYPE } from '../constants';
import { SUBMIT_GP_NOTIFICATIONS } from '../../page/actions';
import { APPLY_GP_ALERTS } from "../../notifications/actions/index";

const defaultFilter = {
    [FILTER_FIELDS.AUTO_REFRESH]: false,
    [FILTER_FIELDS.START]: moment().subtract(1, 'hours').toDate(),
    [FILTER_FIELDS.END]: moment().toDate(),
    [FILTER_FIELDS.RF]: '',
    [FILTER_FIELDS.MRF]: '',
    [FILTER_FIELDS.FILTER]: '',
    [FILTER_FIELDS.CURRENT]: true,
    [FILTER_FIELDS.HISTORICAL]: false,
    [FILTER_FIELDS.TYPE]: GROUP_POLICIES_ALERT_TYPE
};

const initialState = {
    filter: defaultFilter,
    alerts: [],
    appliedFilter: { ...defaultFilter },
    highLight: [],
    total: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_GP_FILTER:
            return { ...state, filter: action.payload.filter };
        case FETCH_GP_ALERTS_SUCCESS:
            return {
                ...state,
                alerts: _.isArray(action.payload.alerts.alerts) ? action.payload.alerts.alerts : [],
                total: action.payload.alerts.total,
            };
        case SUBMIT_GP_NOTIFICATIONS: {
            const alerts = _.get(action, 'payload.notifications', []);
            return {
                ...initialState,
                highLight: alerts,
            };
        }
        case FLUSH_GP_HIGHLIGHT:
            return {
                ...state,
                highLight: [],
            };

        case UNHIGHLIGHT_GP_ALERT:
            return {
                ...state,
                highLight: state.highLight.filter(alert => alert.id !== action.payload.id),
            };
            return state;
        case APPLY_GP_ALERTS:
            const { add, update, remove } = action.payload;
            let { alerts, highLight, total } = state;
            let increment = 0, decrement = 0;

            if (!_.isEmpty(add)) {
                alerts = alerts.concat(add);
                highLight = highLight.concat(add);
                increment = add.length;
            }
            if (!_.isEmpty(update)) {
                alerts = _.unionBy(update, alerts, alert => alert.id);
                _.remove(highLight, alert => update.findIndex(rm => rm.id === alert.id) !== -1);
            }
            if (!_.isEmpty(remove)) {
                decrement = _.remove(alerts, alert => remove.findIndex(rm => rm.id === alert.id) !== -1);
            }
            return {
                ...state,
                alerts,
                highLight,
                total: total + increment - decrement
            };
        case APPLY_GP_FILTER:
            return {
                ...state,
                appliedFilter: action.payload.filter
            };
        default:
            return state;
    }
};