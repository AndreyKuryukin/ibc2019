export const NEW_NOTIFICATIONS = 'notifications/NEW_NOTIFICATION';
export const onNewNotifications = (notifications, topic, count) => ({
    type: NEW_NOTIFICATIONS,
    payload: { notifications, topic, count }
});

export const FLUSH_NOTIFICATIONS = 'notifications/FLUSH_NOTIFICATIONS';
export const flush = (topic, path) => ({
    type: FLUSH_NOTIFICATIONS,
    payload: { topic, path }
});
