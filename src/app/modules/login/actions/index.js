export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const signInSuccess = (userName) => ({
    type: SIGN_IN_SUCCESS,
    payload: { userName }
});
