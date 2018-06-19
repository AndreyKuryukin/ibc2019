import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ButtonGroup as RSButtonGroup, Button } from 'reactstrap';

class ButtonGroup extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            text: PropTypes.string,
            href: PropTypes.string,
            value: PropTypes.any.isRequired,
        })).isRequired,
        color: PropTypes.string,
        onChange: PropTypes.func,
    };
    static defaultProps = {
        color: 'secondary',
    };

    renderButton = (option) => {
        const { value, color, onChange } = this.props;

        const linkProps = {};
        if (option.href !== undefined) {
            linkProps.tag = Link;
            linkProps.to = option.href;
        }
        if (onChange !== undefined) {
            linkProps.onClick = () => onChange(option.value);
        }

        return (
            <Button
                key={option.id}
                color={color}
                outline={option.value !== value}
                style={{ textDecoration: 'none' }}
                {...linkProps}
            >{option.text}</Button>
        );
    };

    render() {
        const { className, options } = this.props;

        return (
            <RSButtonGroup className={className}>
                {options.map(this.renderButton)}
            </RSButtonGroup>
        );
    }
}

export default ButtonGroup;
