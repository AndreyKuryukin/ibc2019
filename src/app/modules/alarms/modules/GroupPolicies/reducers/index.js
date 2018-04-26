import { combineReducers } from 'redux';
import alarms from './alarms';
import viewer from '../modules/Viewer/reducers';

export default combineReducers({
    alarms,
    viewer,
});
