import {combineReducers} from 'redux';
import alerts from './alerts';
import metrics from '../../modules/Metrics/reducers/index';

export default combineReducers({
    alerts,
    metrics,
});
