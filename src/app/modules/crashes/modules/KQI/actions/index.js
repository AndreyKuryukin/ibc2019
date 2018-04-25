
export const FETCH_KQI_HISTORY_SUCCESS = 'crashes/FETCH_KQI_HISTORY_SUCCESS';
export const fetchHistorySuccess = history => ({
    type: FETCH_KQI_HISTORY_SUCCESS,
    payload: { history },
});
