import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

class CheckedCell extends React.PureComponent {
    static propTypes = {
        value: PropTypes.bool,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        value: false,
        style: {},
        onChange: () => null,
    };

    onChange = (event) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event.target.checked);
        }
    };

    render() {
        return (
            <Input
                type="checkbox"
                style={this.props.style}
                onChange={this.onChange}
                checked={this.props.value}
            />
        );
    }
}

export default CheckedCell;
