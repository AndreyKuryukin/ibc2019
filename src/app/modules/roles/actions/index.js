export const FETCH_LIST_OF_ROLES_SUCCESS = 'roles/FETCH_LIST_OF_ROLES_SUCCESS';
export const fetchListOfRolesSuccess = roles => ({
    type: FETCH_LIST_OF_ROLES_SUCCESS,
    payload: { roles },
});

export const DELETE_ROLE_SUCCESS = 'roles/DELETE_ROLE_SUCCESS';
export const deleteRoleSuccess = ids => ({
    type: DELETE_ROLE_SUCCESS,
    payload: { ids },
});

export const CREATE_ROLE = 'roles/CREATE_ROLE';
export const createRole = role => ({
    type: CREATE_ROLE,
    payload: { role },
});

export const UPDATE_ROLE = 'roles/UPDATE_ROLE';
export const updateRole = role => ({
    type: UPDATE_ROLE,
    payload: { role },
});
