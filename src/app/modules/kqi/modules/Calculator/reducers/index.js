import { FETCH_LISTS_SUCCESS, FETCH_PROJECTION_SUCCESS } from '../actions';

const initialState = {
    lists: {
        kqi: [],
        locations: [],
        manufactures: [],
        equipments: [],
        usergroups: [],
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LISTS_SUCCESS:
            return {
                ...state,
                lists: action.payload.lists,
            };
        case FETCH_PROJECTION_SUCCESS:
            return {
                ...state,
                projection: action.payload.projection,
            };
        default:
            return state;
    }
};
