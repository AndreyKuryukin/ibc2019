export const FETCH_MRF_SUCCESS = 'alarms/FETCH_MRF_SUCCESS';
export const fetchMrfSuccess = mrf => ({
    type: FETCH_MRF_SUCCESS,
    payload: { mrf },
});
