import { combineReducers } from 'redux';

import { default as roles } from '../modules/roles/reducers';
import login from '../modules/login/reducers';

export default combineReducers({
    login,
    roles,
});
