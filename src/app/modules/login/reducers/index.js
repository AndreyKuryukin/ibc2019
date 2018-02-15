import {SIGN_IN_ACTION} from "../actions/index";

const initialState = {
    userName: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN_ACTION:
            return {...state, ...action.payload}
    }
    return state;
}