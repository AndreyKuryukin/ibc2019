import rest from '../../../../../rest';

export const FETCH_ROLE = 'roles/FETCH_ROLE';
export const FETCH_ROLE_SUCCESS = 'roles/FETCH_ROLE_SUCCESS';
export const FETCH_ROLE_ERROR = 'roles/FETCH_ROLE_ERROR';

const fetchRoleSuccess = role => ({
    type: FETCH_ROLE_SUCCESS,
    payload: { role },
});

export const fetchRole = async (dispatch, id) => {
    dispatch({ type: FETCH_ROLE });

    try {
        if (id) {
            const urlParams = {
                roleId: id,
            };
            const { data: role } = await rest.get('/api/v1/role/:roleId', { urlParams });
            dispatch(fetchRoleSuccess(role));
        }
    } catch (e) {
        console.error('Error during fetching role', e);
        dispatch({ type: FETCH_ROLE_ERROR });
    }
};
