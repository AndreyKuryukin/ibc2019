import { FETCH_KQI_CONFIGS_SUCCESS, FETCH_KQI_PROJECTIONS_SUCCESS, DELETE_KQI_CONFIG_SUCCESS } from '../actions';

const initialState = {
    configs: [],
    projections: [],
};

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_KQI_CONFIGS_SUCCESS:
            return {
                ...state,
                configs: action.payload.kqi,
            };
        case FETCH_KQI_PROJECTIONS_SUCCESS:
            return {
                ...state,
                projections: action.payload.projections,
            };
        case DELETE_KQI_CONFIG_SUCCESS:
            return {
                ...state,
                configs: state.configs.filter(config => config.id !== action.payload.id),
            };
        default:
            return state;
    }
};
