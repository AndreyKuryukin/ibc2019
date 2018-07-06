import { combineReducers } from 'redux';

import roles from '../modules/roles/reducers';
import login from '../modules/login/reducers';
import users from '../modules/users/reducers';
import user from './user';
import policies from '../modules/policies/reducers';
import kqi from '../modules/kqi/reducers';
import reports from '../modules/reports/reducers';
import sources from '../modules/sources/reducers';
import alarms from '../modules/alarms/reducers';
import notifications from '../modules/notifications/reducers';

export default combineReducers({
    login,
    roles,
    users,
    user,
    policies,
    kqi,
    reports,
    sources,
    alarms,
    notifications
});
