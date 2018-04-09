export const FETCH_USERS_SUCCESS = 'reports/FETCH_USERS_SUCCESS';
export const fetchUsersSuccess = users => ({
    type: FETCH_USERS_SUCCESS,
    payload: { users },
});

export const FETCH_TEMPLATES_SUCCESS = 'reports/FETCH_TEMPLATES_SUCCESS';
export const fetchTemplatesSuccess = templates => ({
    type: FETCH_TEMPLATES_SUCCESS,
    payload: { templates },
});