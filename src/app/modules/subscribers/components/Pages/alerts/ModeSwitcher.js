import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button} from 'reactstrap';

export const MODE = {
    CHART: 'chart',
    GRID: 'grid',
};
const NAMES = {
    [MODE.CHART]: 'График',
    [MODE.GRID]: 'Таблица',
};

class ModeSwitcher extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        value: PropTypes.oneOf(Object.values(MODE)),
        onChange: PropTypes.func.isRequired,
    };

    render() {
        return (
            <ButtonGroup
                className={this.props.className}
                style={this.props.style}
            >
                {Object.values(MODE).map(id => (
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

export default ModeSwitcher;
