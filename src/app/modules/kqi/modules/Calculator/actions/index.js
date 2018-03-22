export const FETCH_LISTS_SUCCESS = 'kqi/FETCH_LISTS_SUCCESS';
export const fetchListsSuccess = lists => ({
    type: FETCH_LISTS_SUCCESS,
    payload: { lists },
});
