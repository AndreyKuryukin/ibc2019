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
