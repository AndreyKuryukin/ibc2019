export const RANGES = {
    HOUR: 'HOUR',
    DAY: 'DAY',
    WEEK: 'WEEK',
};

const SET_RANGE = 'subscribers/kqi/SET_RANGE';
export function setRange(range) {
    return {type: SET_RANGE, payload: {range}};
}


export function selectRange(state) {
    return state.subscribers.kqi.range;
}


export default function kqiRangeReducer(state = RANGES.HOUR, action) {
    if (action.type === SET_RANGE) {
        return action.payload.range;
    }
    return state;
}
