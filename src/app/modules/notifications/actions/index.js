export const UPDATE_ALERTS_NOTIFICATIONS = 'notifications/UPDATE_ALERTS_NOTIFICATIONS';
export const updateAlertsNotifications = (notifications, topic) => ({
    type: UPDATE_ALERTS_NOTIFICATIONS,
    payload: { notifications }
});

export const APPLY_ALERTS = 'notifications/APPLY_ALERTS';
export const applyAlerts = (alerts) => ({
    type: APPLY_ALERTS,
    payload: { alerts }
});

export const CEASE_ALERTS = 'notifications/CEASE_ALERTS';
export const ceaseAlerts = (payload) => ({
    type: CEASE_ALERTS,
    payload
});
