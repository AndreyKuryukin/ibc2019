import { combineReducers } from 'redux';
import policies from './policies';
import editor from '../modules/PolicyEditor/reducers';

export default combineReducers({
    policies,
    editor,
});
