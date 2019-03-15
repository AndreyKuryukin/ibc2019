import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button} from 'reactstrap';
import {RANGES} from '../reducers/kqi/range';

const RANGE_NAMES = {
    [RANGES.HOUR]: 'Час',
    [RANGES.DAY]: 'День',
    [RANGES.WEEK]: 'Неделя',
};

class RangeFilter extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        list: PropTypes.arrayOf(PropTypes.oneOf(Object.values(RANGES))),
        value: PropTypes.oneOf(Object.values(RANGES)),
        onChange: PropTypes.func.isRequired,
    };

    render() {
        return (
            <ButtonGroup
                className={this.props.className}
                style={this.props.style}
            >
                {this.props.list.map(id => (
                    <Button
                        key={id}
                        active={id === this.props.value}
                        onClick={() => this.props.onChange(id)}
                    >{RANGE_NAMES[id]}</Button>
                ))}
            </ButtonGroup>
        );
    }
}

export default RangeFilter;
