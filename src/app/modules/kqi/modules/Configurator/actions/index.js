export const FETCH_PARAMETER_TYPES_SUCCESS = 'kqi/FETCH_PARAMETER_TYPES_SUCCESS';
export const fetchParameterTypesSuccess = paramTypes => ({
    type: FETCH_PARAMETER_TYPES_SUCCESS,
    payload: { paramTypes },
});

export const FETCH_CONFIG_SUCCESS = 'kqi/FETCH_CONFIG_SUCCESS';
export const fetchConfigSuccess = config => ({
    type: FETCH_CONFIG_SUCCESS,
    payload: { config },
});
