import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import Checkbox from '../../Checkbox';

class CheckedCell extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        value: PropTypes.bool,
        checkedPartially: PropTypes.bool,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        value: false,
        style: {},
        onChange: () => null,
    };

    onChange = (checked) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(checked);
        }
    };

    render() {
        return (
            <Checkbox
                id={this.props.id}
                style={this.props.style}
                onChange={this.onChange}
                checked={this.props.value}
                checkedPartially={this.props.checkedPartially}
            />
        );
    }
}

export default CheckedCell;
