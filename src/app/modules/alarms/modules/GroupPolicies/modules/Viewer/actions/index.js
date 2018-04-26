export const FETCH_ALARM_SUCCESS = 'alarms/FETCH_ALARM_SUCCESS';
export const fetchAlarmSuccess = alarm => ({
    type: FETCH_ALARM_SUCCESS,
    payload: { alarm },
});
