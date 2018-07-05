import { FLUSH_NOTIFICATIONS, NEW_NOTIFICATIONS } from "../actions/index";
import * as _ from "lodash";


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

        case FLUSH_NOTIFICATIONS: {
            const countDecrement = _.get(state, `${action.payload.topic}.${action.payload.path}`, []).length;
            const count = _.get(state, `${action.payload.topic}.count`, 0);
            _.set(state, `${action.payload.topic}.${action.payload.path}`, []);
            _.set(state, `${action.payload.topic}.count`, count - countDecrement);
            return { ...state };
        }
        default:
            return state
    }
}