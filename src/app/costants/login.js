export const SIGN_IN_URL = 'api/v1/auth/login';
export const LOGIN_REQUEST = {
    LOGIN: 'login',
    PASSWORD: 'password',
    LANGUAGE: 'language',
};
export const LOGIN_SUCCESS_RESPONSE = {
    USER_NAME: 'userName',
    AUTH: 'authorization',
};

export const LANGUAGES = {
    RUSSIAN: 'RUSSIAN',
    ENGLISH: 'ENGLISH'
};

export const LANGUAGE_OPTIONS = [
    { title: 'Русский', value: LANGUAGES.RUSSIAN },
    { title: 'English', value: LANGUAGES.ENGLISH }
];

export const PLACEHOLDERS = {
    [LANGUAGES.RUSSIAN]: {
        LOGIN: 'Логин',
        PASSWORD: 'Пароль',
        LOG_IN: 'ВХОД'
    },
    [LANGUAGES.ENGLISH]: {
        LOGIN: 'Login',
        PASSWORD: 'Password',
        LOG_IN: 'LOG IN'
    }
};
