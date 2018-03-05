import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import classnames from 'classnames';

import styles from './styles.scss';

class Checkbox extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        checked: PropTypes.bool,
        checkedPartially: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
        checked: false,
        checkedPartially: false,
        className: '',
        style: {},
        onChange: () => null,
    };

    onChange = (event) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event.target.checked);
        }
    };

    render() {
        const { id, style, checked, checkedPartially, className, disabled } = this.props;
        const classNames = classnames(
            styles.checkboxInput,
            className,
            { [styles.checkedPartially]: checkedPartially },
        );
        return (
            <div className={styles.checkboxWrapper}>
                <Input
                    id={id}
                    type="checkbox"
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

export default Checkbox;
