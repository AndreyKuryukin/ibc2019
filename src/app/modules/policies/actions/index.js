export const FETCH_POLICIES_SUCCESS = 'policies/FETCH_POLICIES_SUCCESS';
export const fetchPoliciesSuccess = policies => ({
    type: FETCH_POLICIES_SUCCESS,
    payload: { policies },
});