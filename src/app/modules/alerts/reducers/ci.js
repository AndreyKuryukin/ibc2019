import moment from 'moment';
import _ from 'lodash';
import {
    APPLY_CI_FILTER,
    FETCH_CI_ALERTS_SUCCESS,
    FLUSH_CI_HIGHLIGHT,
    SET_CI_FILTER,
    UNHIGHLIGHT_CI_ALERT
} from '../actions/ci';
import {CI_ALERT_TYPE, FILTER_FIELDS} from '../constants';
import {SUBMIT_CI_NOTIFICATIONS} from '../../page/actions';
import {APPLY_CI_ALERTS} from "../../notifications/actions/index";

const defaultFilter = {
    [FILTER_FIELDS.AUTO_REFRESH]: false,
    [FILTER_FIELDS.START]: moment().subtract(1, 'hours'),
    [FILTER_FIELDS.END]: moment(),
    [FILTER_FIELDS.RF]: '',
    [FILTER_FIELDS.MRF]: '',
    [FILTER_FIELDS.FILTER]: '',
    [FILTER_FIELDS.CURRENT]: true,
    [FILTER_FIELDS.HISTORICAL]: false,
    [FILTER_FIELDS.TYPE]: CI_ALERT_TYPE
};

const initialState = {
    filter: defaultFilter,
    appliedFilter: {[FILTER_FIELDS.TYPE]: CI_ALERT_TYPE},
    alerts: [],
    highLight: [],
    total: 0,
};

const highLightAlerts = (alerts, highLight) => alerts.map(alert => {
    alert.new = !alert.closed && (highLight.findIndex(newAlert => newAlert.id === alert.id) !== -1);
    return alert;
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CI_FILTER:
            return {...state, filter: action.payload.filter};
        case FETCH_CI_ALERTS_SUCCESS:{
            let alerts = _.get(action.payload, 'alerts.alerts', []);
            if (!_.isEmpty(alerts) && !_.isEmpty(state.highLight)) {
                alerts = highLightAlerts(alerts, state.highLight);
            }
            return {
                ...state,
                alerts,
                total: action.payload.alerts.total,
            };
        }
        case SUBMIT_CI_NOTIFICATIONS: {
            const highLight = _.get(action, 'payload.notifications', []);
            let alerts = state.alerts;
            if (!_.isEmpty(alerts)) {
                alerts = highLightAlerts(alerts, highLight)
            }
            return {
                ...initialState,
                alerts,
                highLight: [...highLight],
            };
        }
        case FLUSH_CI_HIGHLIGHT:
            return {
                ...state,
                alerts: highLightAlerts(state.alerts, []),
                highLight: [],
            };
        case UNHIGHLIGHT_CI_ALERT:{
            const highLight = state.highLight;
            const alert = state.alerts.find(alert => alert.id === action.payload.id);
            if (alert) {
                alert.new = false;
            }
            _.remove(highLight, alert => alert.id === action.payload.id);
            return {
                ...state,
                highLight
            };
        }
        case APPLY_CI_ALERTS:
            const {add, update, remove} = action.payload;
            let {alerts, highLight, total} = state;
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
                decrement = _.remove(alerts, alert => remove.findIndex(rm => rm.id === alert.id) !== -1).length;
            }
            return {
                ...state,
                alerts: highLightAlerts(alerts, highLight),
                highLight,
                total: total + increment - decrement
            };
        case APPLY_CI_FILTER:
            return {
                ...state,
                appliedFilter: action.payload.filter
            };
        default:
            return state;
    }
};