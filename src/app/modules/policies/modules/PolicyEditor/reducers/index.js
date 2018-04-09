import { FETCH_POLICY_SUCCESS, RESET_POLICY_EDITOR } from '../actions';

const initialState = {
    policy: {
        name: '',
        notification_template: '',
        threshold: {
            cease_duration: '',
            cease_value: '',
            rise_duration: '',
            rise_value: '',
        },
        scope: ['j1Yqi-scope', 'FXc6A-scope', 'BEOic-scope'],
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_POLICY_SUCCESS:
            return {
                policy: {
                    ...state.policy,
                    ...action.payload.policy
                },
            };
        case RESET_POLICY_EDITOR:
            return {
                policy: initialState.policy,
            };
        default:
            return state;
    }
};
