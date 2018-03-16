export const FETCH_USERS_SUCCESS = 'users/FETCH_USERS_SUCCESS';
export const fetchUsersSuccess = users => ({
    type: FETCH_USERS_SUCCESS,
    payload: { users },
});

export const DELETE_USER_SUCCESS = 'users/DELETE_USER_SUCCESS';
export const deleteUserSuccess = ids => ({
    type: DELETE_USER_SUCCESS,
    payload: { ids },
});

export const FETCH_DIVISIONS_SUCCESS = 'users/FETCH_DIVISIONS';
export const fetchDivisionsSuccess = divisions => ({
    type: FETCH_DIVISIONS_SUCCESS,
    payload: { divisions },
});
