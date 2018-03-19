export const FETCH_LIST_OF_KQI_RESULTS_SUCCESS = 'kqi/FETCH_LIST_OF_KQI_RESULTS_SUCCESS';
export const fetchListOfKQIResultsSuccess = kqi => ({
    type: FETCH_LIST_OF_KQI_RESULTS_SUCCESS,
    payload: { kqi },
});
