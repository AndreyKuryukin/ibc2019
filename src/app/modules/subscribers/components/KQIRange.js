import {connect} from 'react-redux';
import RangeFilter from './RangeFilter';
import {RANGES, selectRange, setRange} from '../reducers/kqi/range';

const list = [RANGES.HOUR, RANGES.DAY, RANGES.WEEK];

const mapStateToProps = state => ({
    list,
    value: selectRange(state),
});
const mapDispatchToProps = dispatch => ({
    onChange: range => dispatch(setRange(range)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RangeFilter);
