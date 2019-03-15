import { combineReducers } from 'redux';

import roles from '../modules/roles/reducers';
import login from '../modules/login/reducers';
import users from '../modules/users/reducers';
import user from './user';
import app from './app';
import common from './common';
import policies from '../modules/policies/reducers';
import kqi from '../modules/kqi/reducers';
import reports from '../modules/reports/reducers';
import sources from '../modules/sources/reducers';
import alerts from '../modules/alerts/reducers';
import subscribers from '../modules/subscribers/reducers';
import notifications from '../modules/notifications/reducers';

export default combineReducers({
    app,
    common,
    subscribers,
    login,
    roles,
    users,
    user,
    policies,
    kqi,
    reports,
    sources,
    alerts,
    notifications
});
