import { FETCH_ALARMS_SUCCESS, FETCH_REGIONS_SUCCESS, FETCH_LOCATIONS_SUCCESS } from '../actions';

const initialState = {
    alarms: [],
    regions: [],
    locations: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALARMS_SUCCESS:
            return {
                ...state,
                alarms: Array.isArray(action.payload.alarms) ? action.payload.alarms : [],
            };
        case FETCH_REGIONS_SUCCESS:
            return {
                ...state,
                regions: Array.isArray(action.payload.regions) ? action.payload.regions : [],
            };
        case FETCH_LOCATIONS_SUCCESS:
            return {
                ...state,
                locations: Array.isArray(action.payload.locations) ? action.payload.locations : [],
            };
        default:
            return state;
    }
};
