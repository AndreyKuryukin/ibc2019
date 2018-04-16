import { FETCH_RESULT_HISTORY_SUCCESS, FETCH_RESULT_SUCCESS } from '../actions'

const initialState = {
    list: [],
    history: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RESULT_SUCCESS: {
            return { ...state, list: action.payload.result }
        }
        case FETCH_RESULT_HISTORY_SUCCESS: {
            return { ...state, history: action.payload.history }
        }
        default: {
            return state;
        }
    }
}