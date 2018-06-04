import { combineReducers } from 'redux';
import gp from './gp';
import kqi from './kqi';
import ci from './ci';
import alarms from './alarms';
import mrf from './mrf';
import viewer from '../modules/Viewer/reducers';

export default combineReducers({
    gp,
    kqi,
    ci,
    alarms,
    mrf,
    viewer,
});
