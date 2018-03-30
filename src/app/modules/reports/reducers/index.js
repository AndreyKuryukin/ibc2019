import { combineReducers } from 'redux';
import reports from './reports';
import editor from '../modules/ConfigEditor/reducers';

export default combineReducers({
    reports,
    editor,
});
