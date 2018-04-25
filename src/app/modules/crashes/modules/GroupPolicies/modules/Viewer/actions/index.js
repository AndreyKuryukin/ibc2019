export const FETCH_ALARM_SUCCESS = 'crashes/FETCH_ALARM_SUCCESS';
export const fetchAlarmSuccess = alarm => ({
    type: FETCH_ALARM_SUCCESS,
    payload: { alarm },
});
