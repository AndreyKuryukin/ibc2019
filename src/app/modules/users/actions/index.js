export const FETCH_USERS_SUCCESS = 'users/FETCH_USERS_SUCCESS';
export const fetchUsersSuccess = (users) => ({
    type: FETCH_USERS_SUCCESS,
    payload: { users },
});
