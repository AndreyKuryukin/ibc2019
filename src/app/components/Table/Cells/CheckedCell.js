import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../Checkbox';
import Radio from "../../Radio/index";

class CheckedCell extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['check', 'radio']),
        text: PropTypes.string,
        value: PropTypes.bool,
        checkedPartially: PropTypes.bool,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        text: '',
        value: false,
        type: 'check',
        style: {},
        onChange: () => null,
    };

    onChange = (checked) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(checked);
        }
    };

    render() {
        const { type, text, value, checkedPartially, id } = this.props;
        const style = {
            marginRight: text ? 10 : 0,
            ...this.props.style,
        };
        const Component = type === 'check' ? Checkbox : Radio;
        return (
            <div className="table-cell-content" title={text}>
                <Component
                    id={id}
                    style={style}
                    onChange={this.onChange}
                    checked={value}
                    checkedPartially={checkedPartially}
                />
                <span className="truncated">{text}</span>
            </div>
        );
    }
}

export default CheckedCell;
