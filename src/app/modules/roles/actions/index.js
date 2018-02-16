import rest from '../../../rest';

export const FETCH_LIST_OF_ROLES = 'roles/FETCH_LIST_OF_ROLES';
export const FETCH_LIST_OF_ROLES_SUCCESS = 'roles/FETCH_LIST_OF_ROLES_SUCCESS';
export const FETCH_LIST_OF_ROLES_ERROR = 'roles/FETCH_LIST_OF_ROLES_ERROR';

const fetchListOfRolesSuccess = roles => ({
    type: FETCH_LIST_OF_ROLES_SUCCESS,
    payload: { roles },
});

export const fetchListOfRoles = async (dispatch, login) => {
    dispatch({ type: FETCH_LIST_OF_ROLES });

    try {
        if (login) {
            const urlParams = {
                login,
            };
            const { data: roles } = await rest.get('/api/v1/role/user/:login', { urlParams });
            dispatch(fetchListOfRolesSuccess(roles));
        }
    } catch(e) {
        console.error('Error during fetching list of roles', e);
        dispatch({ type: FETCH_LIST_OF_ROLES_ERROR });
    }
};

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
            const role = await rest.get('/api/v1/role/:roleId', { urlParams });
            dispatch(fetchRoleSuccess(role));
        }
    } catch(e) {
        console.error('Error during fetching role', e);
        dispatch({ type: FETCH_ROLE_ERROR });
    }
};

export const DELETE_ROLE = 'roles/DELETE_ROLE';
export const DELETE_ROLE_SUCCESS = 'roles/DELETE_ROLE_SUCCESS';
export const DELETE_ROLE_ERROR = 'roles/DELETE_ROLE_ERROR';

const deleteRoleSuccess = id => ({
    type: DELETE_ROLE_SUCCESS,
    payload: { id },
});

export const deleteRole = async (dispatch, id) => {
    dispatch({ type: DELETE_ROLE });

    try {
        const urlParams = {
            roleId: id,
        };
        await rest.delete('/api/v1/role/:roleId', { urlParams });
        dispatch(deleteRoleSuccess(id));
    } catch(e) {
        console.error('Error during deleting role', e);
        dispatch({ type: DELETE_ROLE_ERROR });
    }
};

export const CREATE_ROLE = 'roles/CREATE_ROLE';
const createRole = role => ({
    type: CREATE_ROLE,
    payload: { role },
});

const addRole = async (dispatch, role) => {
    try {
        const { data: createdRole } = await rest.post('/api/v1/role', role);
        dispatch(createRole(createdRole));
    } catch(e) {
        console.error('Error during creating role', e);
    }
};

export const UPDATE_ROLE = 'roles/UPDATE_ROLE';
const updateRole = role => ({
    type: UPDATE_ROLE,
    payload: { role },
});

const putRole = async (dispatch, role) => {
    try {
        const updatedRole = await rest.put('/api/v1/role', role);
        dispatch(updateRole(updatedRole));
    } catch(e) {
        console.error('Error during updating role', e);
    }
};

export const submitRole = (dispatch, roleId, role) => {
    const sendRole = roleId ? putRole : addRole;

    sendRole(dispatch, role);
};
