export const FETCH_USER_SUCCESS = 'users/FETCH_USER_SUCCESS';
export const fetchUserSuccess = user => ({
    type: FETCH_USER_SUCCESS,
    payload: { user },
});

export const FETCH_ROLES_SUCCESS = 'users/FETCH_ROLES';
export const fetchRolesSuccess = roles => ({
    type: FETCH_ROLES_SUCCESS,
    payload: { roles },
});

export const FETCH_GROUPS_SUCCESS = 'users/FETCH_GROUPS';
export const fetchGroupsSuccess = groups => ({
    type: FETCH_GROUPS_SUCCESS,
    payload: { groups },
});

export const CREATE_USER = 'users/CREATE_USER';
export const createUser = user => ({
    type: CREATE_USER,
    payload: { user },
});

export const UPDATE_USER = 'users/UPDATE_USER';
export const updateUser = user => ({
    type: UPDATE_USER,
    payload: { user },
});
