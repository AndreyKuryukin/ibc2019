import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

import styles from './styles.scss';

class Field extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        labelText: PropTypes.string,
        labelWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        inputWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        labelAlign: PropTypes.oneOf(['left', 'right']),
        required: PropTypes.bool,
        children: PropTypes.node,
    }

    static defaultProps = {
        id: '',
        labelText: '',
        labelWidth: '50%',
        inputWidth: '50%',
        labelAlign: 'left',
        required: false,
        children: null,
    }

    render() {
        const { id, labelText, labelWidth, labelAlign, inputWidth, required, children } = this.props;
        const classes = classNames(
            styles.fieldWrapper,
            { [styles.required]: required },
            { [styles.rightLabel]: labelAlign === 'right' },
        );
        return (
            <div className={classes}>
                <label
                    htmlFor={id}
                    className={styles.fieldLabel}
                    style={{ width: labelWidth }}
                >{labelText}</label>
                <div
                    className={styles.fieldInput}
                    style={{ width: inputWidth }}
                >{children}</div>
            </div>
        );
    }
}

export default Field;
