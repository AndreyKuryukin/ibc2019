export const FETCH_ROLE_SUCCESS = 'roles/FETCH_ROLE_SUCCESS';
export const fetchRoleSuccess = role => ({
    type: FETCH_ROLE_SUCCESS,
    payload: { role },
});

export const FETCH_SUBJECTS_SUCCESS = 'roles/FETCH_SUBJECTS_SUCCESS';
export const fetchSubjectsSuccess = subjects => ({
    type: FETCH_SUBJECTS_SUCCESS,
    payload: { subjects },
});

export const FETCH_ACCESS_LEVEL_TYPES_SUCCESS = 'roles/FETCH_ACCESS_LEVEL_TYPES_SUCCESS';
export const fetchAccessLevelTypesSuccess = types => ({
    type: FETCH_ACCESS_LEVEL_TYPES_SUCCESS,
    payload: { types },
});

export const RESET_ROLES_EDITOR = 'roles/RESET_ROLES_EDITOR';
export const resetRolesEditor = () => ({ type: RESET_ROLES_EDITOR });
