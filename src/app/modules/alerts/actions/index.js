export const FETCH_MRF_SUCCESS = 'alerts/FETCH_MRF_SUCCESS';
export const fetchMrfSuccess = mrf => ({
    type: FETCH_MRF_SUCCESS,
    payload: { mrf },
});

export const FETCH_POLICIES_SUCCESS = 'alerts/FETCH_POLICIES_SUCCESS';
export const fetchPoliciesSuccess = policies => ({
    type: FETCH_POLICIES_SUCCESS,
    payload: { policies },
});
