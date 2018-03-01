export const FETCH_POLICY_SUCCESS = 'policies/FETCH_POLICY_SUCCESS';
export const fetchPolicySuccess = policy => ({
    type: FETCH_POLICY_SUCCESS,
    payload: { policy },
});

export const RESET_POLICY_EDITOR = 'policies/RESET_POLICY_EDITOR';
export const resetPolicyEditor = () => ({ type: RESET_POLICY_EDITOR });

export const CREATE_POLICY = 'policies/CREATE_POLICY';
export const createPolicy = policy => ({
    type: CREATE_POLICY,
    payload: { policy },
});

export const UPDATE_POLICY = 'policies/UPDATE_POLICY';
export const updatePolicy = policy => ({
    type: UPDATE_POLICY,
    payload: { policy },
});
