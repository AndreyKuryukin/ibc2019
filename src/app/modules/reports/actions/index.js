export const FETCH_REPORTS_SUCCESS = 'reports/FETCH_REPORTS_SUCCESS';
export const fetchReportsSuccess = reports => ({
    type: FETCH_REPORTS_SUCCESS,
    payload: { reports },
});

export const REMOVE_RESULT = 'reports/REMOVE_RESULT';
export const removeResult = id => ({
    type: REMOVE_RESULT,
    payload: { id },
});