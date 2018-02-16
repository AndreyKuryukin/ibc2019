import { combineReducers } from 'redux';
import { default as roles } from './roles';
import { default as editor } from '../modules/RoleEditor/reducers';

export default combineReducers({
    roles,
    editor,
});