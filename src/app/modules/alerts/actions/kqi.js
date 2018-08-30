
export const FETCH_KQI_ALERTS_SUCCESS = 'alerts/FETCH_KQI_ALERTS_SUCCESS';
export const fetchKqiAlertsSuccess = (alerts) => ({
    type: FETCH_KQI_ALERTS_SUCCESS,
    payload: { alerts },
});

export const SET_KQI_FILTER = 'alerts/kqi/SET_KQI_FILTER';
export const fetchKqiFilter = filter => ({
    type: SET_KQI_FILTER,
    payload: { filter },
});

export const FLUSH_KQI_HIGHLIGHT = 'alerts/kqi/FLUSH_KQI_HIGHLIGHT';
export const flushKqiHighlight = () => ({
    type: FLUSH_KQI_HIGHLIGHT
});

export const UNHIGHLIGHT_KQI_ALERT = 'alerts/kqi/UNHIGHLIGHT_KQI_ALERT';
export const unhighlightKqiAlert = id => ({
    type: UNHIGHLIGHT_KQI_ALERT,
    payload: { id },
});

export const APPLY_KQI_FILTER = 'alerts/kqi/APPLY_KQI_FILTER';
export const applyKqiFilter = filter => ({
    type: APPLY_KQI_FILTER,
    payload: { filter },
})