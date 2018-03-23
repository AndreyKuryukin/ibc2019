import {
    FETCH_LISTS_SUCCESS
} from '../actions';

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
    switch(action.type) {
        case FETCH_LISTS_SUCCESS:
            return {
                ...state,
                lists: action.payload.lists,
            };
        default:
            return state;
    }
};
