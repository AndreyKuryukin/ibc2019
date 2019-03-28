import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button} from 'reactstrap';

export const TYPE = {
    KI: 'SIMPLE',
    GP: 'GROUP_AGGREGATION',
    KQI: 'KQI',
};
const NAMES = {
    [TYPE.KI]: 'Client incidents',
    [TYPE.GP]: 'Group incidents',
    [TYPE.KQI]: 'KQI incidents',
};

class TypeFilter extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        value: PropTypes.oneOf(Object.values(TYPE)),
        onChange: PropTypes.func.isRequired,
    };

    render() {
        return (
            <ButtonGroup
                className={this.props.className}
                style={this.props.style}
            >
                {Object.values(TYPE).map(id => (
                    <Button
                        key={id}
                        active={id === this.props.value}
                        onClick={() => this.props.onChange(id)}
                    >{NAMES[id]}</Button>
                ))}
            </ButtonGroup>
        );
    }
}

export default TypeFilter;
