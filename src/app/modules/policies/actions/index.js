export const FETCH_POLICIES_SUCCESS = 'policies/FETCH_POLICIES_SUCCESS';
export const fetchPoliciesSuccess = policies => ({
    type: FETCH_POLICIES_SUCCESS,
    payload: { policies },
});

export const FETCH_SCOPES_SUCCESS = 'policies/FETCH_SCOPES_SUCCESS';
export const fetchScopesSuccess = scopes => ({
    type: FETCH_SCOPES_SUCCESS,
    payload: { scopes  },
});

export const FETCH_TYPES_SUCCESS = 'policies/FETCH_TYPES_SUCCESS';
export const fetchTypesSuccess = types => ({
    type: FETCH_TYPES_SUCCESS,
    payload: { types },
});
