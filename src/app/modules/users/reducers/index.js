import { combineReducers } from 'redux';
import users from './users';
import editor from '../modules/UserEditor/reducers';

export default combineReducers({
    users,
    editor,
});
