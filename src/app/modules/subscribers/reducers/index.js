import {combineReducers} from 'redux';
import search from '../modules/Search/reducers';
import topology from '../modules/Topology/reducers';
import pages from './pages';
import kqi from './kqi';

export default combineReducers({
    search,
    topology,
    pages,
    kqi,
});
