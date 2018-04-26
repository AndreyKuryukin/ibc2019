import { combineReducers } from 'redux';
import groupPolicies from '../modules/GroupPolicies/reducers';
import kqi from '../modules/KQI/reducers';

export default combineReducers({
    groupPolicies,
    kqi
});
