import { combineReducers } from 'redux';
import kqi from './kqi';
import calculator from '../modules/Calculator/reducers';
import configurator from '../modules/Configurator/reducers';

export default combineReducers({
    kqi,
    calculator,
    configurator,
});
