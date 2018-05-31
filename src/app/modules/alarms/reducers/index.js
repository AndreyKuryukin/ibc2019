import { combineReducers } from 'redux';
import gp from '../modules/AlarmsContent/reducers/gp';
import kqi from '../modules/AlarmsContent/reducers/kqi';
import ci from '../modules/AlarmsContent/reducers/ci';
import alarms from '../modules/AlarmsContent/reducers/alarms';
import mrf from './mrf';

export default combineReducers({
    gp,
    kqi,
    ci,
    alarms,
    mrf,
});
