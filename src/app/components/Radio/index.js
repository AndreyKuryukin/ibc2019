import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import classnames from 'classnames';

import styles from './styles.scss';

class Radio extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        itemId: PropTypes.string,
        disabled: PropTypes.bool,
        checked: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        itemId: '',
        disabled: false,
        checked: false,
        className: '',
        style: {},
        onChange: () => null,
    };

    onChange = (e) => {
        if (typeof this.props.onChange === 'function') {
            const value = e.target.id;
            this.props.onChange(value);
        }
    }

    render() {
        const { id, name, style, checked, className, disabled, itemId } = this.props;
        const classNames = classnames(
            styles.radioInput,
            className,
        );
        return (
            <div className={styles.radioWrapper}>
                <Input
                    itemId={itemId}
                    id={id}
                    name={name}
                    type="radio"
                    style={this.props.style}
                    onChange={this.onChange}
                    checked={checked}
                    disabled={disabled}
                />
                <label
                    htmlFor={id}
                    style={style}
                    className={classNames}
                />
            </div>
        );
    }
}

export default Radio;
