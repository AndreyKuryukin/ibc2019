export const FETCH_ACTIVE_USER_SUCCESS = 'app/FETCH_ACTIVE_USER_SUCCESS ';
export const fetchActiveUserSuccess = user => ({
    type: FETCH_ACTIVE_USER_SUCCESS,
    payload: { user },
});

export const RESET_ACTIVE_USER_SUCCESS = 'app/RESET_ACTIVE_USER_SUCCESS ';
export const resetActiveUserSuccess = () => ({ type: RESET_ACTIVE_USER_SUCCESS });

export const SET_LANGUAGE = 'SET_LANGUAGE';
export const setLanguage = language => ({
    type: SET_LANGUAGE,
    payload: { language },
});
