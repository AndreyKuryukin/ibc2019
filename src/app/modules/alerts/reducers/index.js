import { combineReducers } from 'redux';
import gp from './gp';
import kqi from './kqi';
import ci from './ci';
import alerts from './alerts';
import policies from './policies';
import mrf from './mrf';
import viewer from '../modules/Viewer/reducers';

export default combineReducers({
    gp,
    kqi,
    ci,
    policies,
    mrf,
    viewer,
});
