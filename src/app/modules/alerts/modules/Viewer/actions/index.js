export const FETCH_ALERT_SUCCESS = 'alerts/FETCH_ALERT_SUCCESS';
export const fetchAlertSuccess = alert => ({
    type: FETCH_ALERT_SUCCESS,
    payload: { alert },
});
