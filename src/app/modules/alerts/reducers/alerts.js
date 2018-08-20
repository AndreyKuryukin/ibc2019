import _ from 'lodash';
import { FETCH_ALERTS_SUCCESS } from '../actions';
import { APPLY_ALERTS } from "../../notifications/actions/index";

const initialState = {
    alerts: [],
    total: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALERTS_SUCCESS:
            return {
                ...state,
                alerts: _.isArray(action.payload.alerts.alerts) ? action.payload.alerts.alerts : [],
                total: action.payload.alerts.total,
            };
        case APPLY_ALERTS:
            const { alerts: oldAlerts = [] } = state;
            const { add = [], remove = [], update = [] } = _.get(action.payload, 'alerts');

            //ADD
            let alerts = oldAlerts.concat(add.map(alert => {
                alert.new = true;
                return alert
            }));
            //REMOVE
            alerts = alerts.filter(alert => remove.findIndex(rem => rem.id === alert.id) === -1);
            //UPDATE
            alerts.forEach((alert, index, array) => {
                const target = _.find(update, each => each.id === alert.id);
                if (target) {
                    array[index] = target;
                }
            });

            return {
                ...state,
                alerts,
                total: alerts.length,
            };
        default:
            return state;
    }
};