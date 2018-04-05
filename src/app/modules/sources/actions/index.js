export const FETCH_SUCCESS = 'sources/FETCH_SUCCESS';
export const fetchSourcesSuccess = sources => ({
    type: FETCH_SUCCESS,
    payload: { sources },
});
