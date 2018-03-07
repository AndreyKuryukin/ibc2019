import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../Checkbox';

class CheckedCell extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        text: PropTypes.string,
        value: PropTypes.bool,
        checkedPartially: PropTypes.bool,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        text: '',
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
        const style = {
            marginRight: this.props.text ? 10 : 0,
            ...this.props.style,
        };
        return (
            <div>
                <Checkbox
                    id={this.props.id}
                    style={style}
                    onChange={this.onChange}
                    checked={this.props.value}
                    checkedPartially={this.props.checkedPartially}
                />
                {this.props.text}
            </div>
        );
    }
}

export default CheckedCell;
