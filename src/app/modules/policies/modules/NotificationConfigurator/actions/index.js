export const FETCH_ADAPTERS_SUCCESS = 'policies/FETCH_ADAPTERS_SUCCESS';
export const fetchAdaptersSuccess = adapters => ({
    type: FETCH_ADAPTERS_SUCCESS,
    payload: { adapters },
});

export const FETCH_NOTIFICATIONS_SUCCESS = 'policies/FETCH_NOTIFICATIONS_SUCCESS';
export const fetchNotificationsSuccess = notifications => ({
    type: FETCH_NOTIFICATIONS_SUCCESS,
    payload: { notifications },
});
