export const SUBMIT_CI_NOTIFICATIONS = 'notification/SUBMIT_CI_NOTIFICATIONS ';
export const submitCiNotifications = (notifications) => ({
    type: SUBMIT_CI_NOTIFICATIONS,
    payload: { notifications },
});

export const SUBMIT_GP_NOTIFICATIONS = 'notification/SUBMIT_GP_NOTIFICATIONS ';
export const submitGpNotifications = (notifications) => ({
    type: SUBMIT_GP_NOTIFICATIONS,
    payload: { notifications },
});

export const SUBMIT_KQI_NOTIFICATIONS = 'notification/SUBMIT_KQI_NOTIFICATIONS ';
export const submitKqiNotifications = (notifications) => ({
    type: SUBMIT_KQI_NOTIFICATIONS,
    payload: { notifications },
});

