export const SEARCH_PARAMS = {
    SERVICE_ID: 'serviceId',
    SAN: 'san',
    MAC: 'mac',
    NLS: 'nls',
};
export const SEARCH_OPTIONS = {
    ALL: null,
    ...SEARCH_PARAMS,
};

const initialState = {
    list: null,
    byId: {},
    byServiceId: {},
    byFakeId: null,
    isLoading: false,
};


const SEARCH_SUCCESS = 'subscribers/SEARCH_SUCCESS';
export const searchSuccess = subscribers => ({type: SEARCH_SUCCESS, payload: {subscribers}});

const SEARCH_START = 'subscribers/SEARCH_START';
export const searchStart = () => ({type: SEARCH_START});

export const RESET_SEARCH_RESULTS = 'subscribers/RESET_SEARCH_RESULTS';
export const resetSearchResults = () => ({type: RESET_SEARCH_RESULTS});

export function selectSubscriber(state, props) {
    return state.subscribers.search.byServiceId[decodeURIComponent(props.id)] || null;
}

export function selectFirstSubscriber(state) {
    const subscribers = Object.values(state.subscribers.search.byId) || [];
    if (subscribers.length > 1) {
       console.warn('EMBEDDED: Multiple subscribers found !!!')
    }
    return subscribers[0] || null;
}

export function selectSubscribersSearchResult(state) {
    const search = state.subscribers.search;
    if (!search.byFakeId) return null;
    return Object.values(search.byFakeId)
}
export function isSubscribersLoading(state) {
    return state.subscribers.search.isLoading;
}

function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_SUCCESS: return {
            ...state,
            byFakeId: action.payload.subscribers.reduce((r, s) => ({
                ...r,
                [`${s.nls}-${s.san}-${s.service_id}`]: s,
            }), {}),
            list: action.payload.subscribers.map(s => s.nls),
            byId: action.payload.subscribers.reduce((r, s) => ({
                ...r,
                [s.nls]: s,
            }), {}),
            isLoading: false,
            byServiceId: action.payload.subscribers.reduce((r, s) => ({
                ...r,
                [s.service_id]: s,
            }), {}),
        };
        case SEARCH_START: return {
            ...state,
            list: initialState.list,
            byId: initialState.byId,
            isLoading: true,
        };
        case RESET_SEARCH_RESULTS: return {
            ...state,
            list: initialState.list,
            byId: initialState.byId,
            byFakeId: initialState.byFakeId,
        };
        default: return state;
    }
}

export default searchReducer;
