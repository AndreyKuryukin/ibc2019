export const FETCH_POLICY_SUCCESS = 'policies/FETCH_POLICY_SUCCESS';
export const fetchPolicySuccess = policy => ({
    type: FETCH_POLICY_SUCCESS,
    payload: { policy },
});

export const RESET_POLICY_EDITOR = 'policies/RESET_POLICY_EDITOR';
export const resetPolicyEditor = () => ({ type: RESET_POLICY_EDITOR });
