export const UPDATE_ALERTS_NOTIFICATIONS = 'notifications/UPDATE_ALERTS_NOTIFICATIONS';
export const updateAlertsNotifications = (notifications, topic) => ({
    type: UPDATE_ALERTS_NOTIFICATIONS,
    payload: { notifications }
});

export const APPLY_CI_ALERTS = 'notifications/APPLY_CI_ALERTS';
export const applyCiAlerts = (alerts) => ({
    type: APPLY_CI_ALERTS,
    payload: alerts
});

export const APPLY_GP_ALERTS = 'notifications/APPLY_GP_ALERTS';
export const applyGpAlerts = (alerts) => ({
    type: APPLY_GP_ALERTS,
    payload: alerts
});

export const APPLY_KQI_ALERTS = 'notifications/APPLY_KQI_ALERTS';
export const applyKqiAlerts = (alerts) => ({
    type: APPLY_KQI_ALERTS,
    payload: alerts
});
