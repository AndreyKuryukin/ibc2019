export const FETCH_REPORTS_SUCCESS = 'reports/FETCH_REPORTS_SUCCESS';
export const fetchReportsSuccess = reports => ({
    type: FETCH_REPORTS_SUCCESS,
    payload: { reports },
});