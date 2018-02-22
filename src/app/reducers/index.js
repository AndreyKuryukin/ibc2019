import { combineReducers } from 'redux';

import roles from '../modules/roles/reducers';
import login from '../modules/login/reducers';
import users from '../modules/users/reducers';
import user from './user';

export default combineReducers({
    login,
    roles,
    users,
    user
});
