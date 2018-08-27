import { NEW_NOTIFICATIONS } from "../actions/index";
import * as _ from "lodash";
import { UNHIGHLIGHT_CI_ALERT } from "../../alerts/actions/ci";
import { UNHIGHLIGHT_GP_ALERT } from "../../alerts/actions/gp";
import { UNHIGHLIGHT_KQI_ALERT } from "../../alerts/actions/kqi";
import { CI_ALERT_TYPE, GROUP_POLICIES_ALERT_TYPE, KQI_ALERT_TYPE } from "../../alerts/constants";


const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case NEW_NOTIFICATIONS: {
            let { topic, notifications, count } = action.payload;
            if (_.isUndefined(state[topic])) {
                state[topic] = {};
            }
            state[topic] = _.mergeWith(state[topic], notifications, (dst, src) => {
                if (_.isArray(dst)) {
                    return dst.concat(src);
                }
            });
            state[topic].count = (state[topic].count || 0) + count;
            return { ...state };
        }

        case UNHIGHLIGHT_CI_ALERT: {
            const alerts = _.get(state, 'alerts');
            const ci_alerts = _.get(alerts, CI_ALERT_TYPE, []);
            const decrement = _.remove(ci_alerts, alert => alert.id === action.payload.id).length;
            return {
                ...state,
                alerts: {
                    ...alerts,
                    [CI_ALERT_TYPE] : ci_alerts,
                    count: alerts.count - decrement
                }
            }
        }

        case UNHIGHLIGHT_GP_ALERT: {
            const alerts = _.get(state, 'alerts');
            const gp_alerts = _.get(alerts, GROUP_POLICIES_ALERT_TYPE, []);
            const decrement = _.remove(gp_alerts, alert => alert.id === action.payload.id).length;
            return {
                ...state,
                alerts: {
                    ...alerts,
                    [GROUP_POLICIES_ALERT_TYPE] : gp_alerts,
                    count: alerts.count - decrement
                }
            }
        }

        case UNHIGHLIGHT_KQI_ALERT: {
            const alerts = _.get(state, 'alerts');
            const kqi_alerts = _.get(alerts, KQI_ALERT_TYPE, []);
            const decrement = _.remove(kqi_alerts, alert => alert.id === action.payload.id).length;
            return {
                ...state,
                alerts: {
                    ...alerts,
                    [KQI_ALERT_TYPE] : kqi_alerts,
                    count: alerts.count - decrement
                }
            }
        }

        default:
            return state
    }
}