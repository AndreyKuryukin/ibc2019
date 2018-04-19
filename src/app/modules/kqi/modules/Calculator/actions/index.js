export const FETCH_LISTS_SUCCESS = 'kqi/FETCH_LISTS_SUCCESS';
export const fetchListsSuccess = lists => ({
    type: FETCH_LISTS_SUCCESS,
    payload: { lists },
});

export const FETCH_PROJECTION_SUCCESS = 'kqi/FETCH_PROJECTION_SUCCESS';
export const fetchProjectionSuccess = projection => ({
    type: FETCH_PROJECTION_SUCCESS,
    payload: { projection },
});
