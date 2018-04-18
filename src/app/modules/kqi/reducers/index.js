import { combineReducers } from 'redux';
import kqi from './kqi';
import calculator from '../modules/Calculator/reducers';
import configurator from '../modules/Configurator/reducers';
import results from '../modules/ResultsViewer/reducers';

export default combineReducers({
    kqi,
    calculator,
    configurator,
    results: results
});
