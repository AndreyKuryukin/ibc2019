export const FETCH_RESULT_SUCCESS = 'kqiProjection/FETCH_RESULT_SUCCESS';
export const fetchResultSuccess = (result) => ({
    type: FETCH_RESULT_SUCCESS,
    payload: { result }
});

export const FETCH_RESULT_HISTORY_SUCCESS = 'kqiProjection/FETCH_RESULT_HISTORY_SUCCESS';
export const fetchResultHistorySuccess = (history) => ({
    type: FETCH_RESULT_HISTORY_SUCCESS,
    payload: { history }
});