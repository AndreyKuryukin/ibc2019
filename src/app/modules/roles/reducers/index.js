import { combineReducers } from 'redux';
import roles from './roles';
import editor from '../modules/RoleEditor/reducers';

export default combineReducers({
    roles,
    editor,
});
