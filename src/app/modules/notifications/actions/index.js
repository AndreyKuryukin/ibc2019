export const NEW_NOTIFICATIONS = 'notifications/NEW_NOTIFICATION';
export const onNewNotifications = (notifications, topic, count) => ({
    type: NEW_NOTIFICATIONS,
    payload: { notifications, topic, count }
});

export const FLIUSH_NOTIFICATIONS = 'notifications/FLIUSH_NOTIFICATIONS';
export const flush = (topic, path) => ({
    type: FLIUSH_NOTIFICATIONS,
    payload: { topic, path }
});
