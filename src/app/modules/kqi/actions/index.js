export const FETCH_KQI_CONFIGS_SUCCESS = 'kqi/FETCH_KQI_CONFIGS_SUCCESS';
export const fetchKQIConfigsSuccess = kqi => ({
    type: FETCH_KQI_CONFIGS_SUCCESS,
    payload: { kqi },
});

export const FETCH_KQI_PROJECTIONS_SUCCESS = 'kqi/FETCH_KQI_PROJECTIONS_SUCCESS';
export const fetchKQIProjectionsSuccess = projections => ({
    type: FETCH_KQI_PROJECTIONS_SUCCESS,
    payload: { projections },
});
