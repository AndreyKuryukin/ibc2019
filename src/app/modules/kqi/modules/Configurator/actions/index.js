export const FETCH_PARAMETER_TYPES_SUCCESS = 'kqi/FETCH_PARAMETER_TYPES_SUCCESS';
export const fetchParameterTypesSuccess = paramTypes => ({
    type: FETCH_PARAMETER_TYPES_SUCCESS,
    payload: { paramTypes },
});
