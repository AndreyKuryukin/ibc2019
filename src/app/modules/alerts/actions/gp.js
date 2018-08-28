
export const FETCH_GP_ALERTS_SUCCESS = 'alerts/FETCH_GP_ALERTS_SUCCESS';
export const fetchGpAlertsSuccess = (alerts) => ({
    type: FETCH_GP_ALERTS_SUCCESS,
    payload: { alerts },
});

export const SET_GP_FILTER = 'alerts/gp/SET_GP_FILTER';
export const fetchGpFilter = filter => ({
    type: SET_GP_FILTER,
    payload: { filter },
});

export const FLUSH_GP_HIGHLIGHT = 'alerts/gp/FLUSH_GP_HIGHLIGHT';
export const flushGpHighlight = () => ({
    type: FLUSH_GP_HIGHLIGHT
});

export const UNHIGHLIGHT_GP_ALERT = 'alerts/gp/UNHIGHLIGHT_GP_ALERT';
export const unhighlightGpAlert = id => ({
    type: UNHIGHLIGHT_GP_ALERT,
    payload: { id },
});

export const APPLY_GP_FILTER = 'alerts/gp/APPLY_GP_FILTER';
export const applyGpFilter = filter => ({
    type: APPLY_GP_FILTER,
    payload: { filter },
});

