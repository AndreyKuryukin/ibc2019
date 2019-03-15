import {combineReducers} from 'redux';
import mac from './mac';
import devices from './devices';
import range from './range';

export default combineReducers({
    mac,
    devices,
    range,
});
