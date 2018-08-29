

export const FETCH_CI_ALERTS_SUCCESS = 'alerts/FETCH_CI_ALERTS_SUCCESS';
export const fetchCiAlertsSuccess = (alerts) => ({
    type: FETCH_CI_ALERTS_SUCCESS,
    payload: { alerts },
});

export const SET_CI_FILTER = 'alerts/ci/SET_CI_FILTER';
export const setCiFilter = filter => ({
    type: SET_CI_FILTER,
    payload: { filter },
});

export const FLUSH_CI_HIGHLIGHT = 'alerts/ci/FLUSH_CI_HIGHLIGHT';
export const flushCiHighlight = () => ({
    type: FLUSH_CI_HIGHLIGHT
});

export const UNHIGHLIGHT_CI_ALERT = 'alerts/ci/UNHIGHLIGHT_CI_ALERT';
export const unhighlightCiAlert = id => ({
    type: UNHIGHLIGHT_CI_ALERT,
    payload: { id },
});


export const APPLY_CI_FILTER = 'alerts/ci/APPLY_CI_FILTER';
export const applyCiFilter = filter => ({
    type: APPLY_CI_FILTER,
    payload: { filter },
});
