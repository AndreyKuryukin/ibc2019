import { combineReducers } from 'redux';
import policies from './policies';
import scopes from './scopes';
import types from './types';
import editor from '../modules/PolicyEditor/reducers';

export default combineReducers({
    policies,
    editor,
    types,
    scopes
});
