import {RANGES, selectRange} from '../../../reducers/kqi/range';

const reduceParameters = parameters => parameters.reduce((acc, param) => ({
    ...acc,
    [param.name]: { ...param },
}), {});

const initialState = {
    metrics: [],
    parametersByName: {},
    isLoading: false,
};


const FETCH_METRICS = 'subscribers/metrics/FETCH_METRICS';
export function fetchMetrics() {
    return {type: FETCH_METRICS};
}
const FETCH_METRCIS_SUCCESS = 'subscribers/metrics/FETCH_METRICS_SUCCESS';
export function fetchMetricsSuccess(metrics, parameters) {
    return {type: FETCH_METRCIS_SUCCESS, payload: { metrics, parameters }};
}

const r = state => state.subscribers.pages.metrics;

export function selectRangeDuration(state) {
    const range = selectRange(state);

    return {
        [RANGES.HOUR]: 1,
        [RANGES.DAY]: 24,
        [RANGES.WEEK]: 24 * 7,
    }[range];
}

export function selectMetrics(state) {
    return r(state).metrics;
}

export function selectIsMetricsLoading(state) {
    return r(state).isLoading;
}

export function selectParameters(state) {
    return r(state).parametersByName;
}

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_METRICS: return {
            ...state,
            metrics: initialState.metrics,
            isLoading: true,
        };
        case FETCH_METRCIS_SUCCESS: return {
            ...state,
            metrics: action.payload.metrics,
            parametersByName: reduceParameters(action.payload.parameters),
            isLoading: false,
        };
        default: return state;
    }
}
