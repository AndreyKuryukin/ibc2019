export const FETCH_ACTIVE_USER_SUCCESS = 'app/FETCH_ACTIVE_USER_SUCCESS ';
export const fetchActiveUserSuccess = user => ({
    type: FETCH_ACTIVE_USER_SUCCESS,
    payload: { user },
});
