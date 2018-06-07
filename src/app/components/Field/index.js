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
        style: PropTypes.object,
        title: PropTypes.string,
        splitter: PropTypes.string
    };

    static defaultProps = {
        id: '',
        labelText: '',
        labelWidth: null,
        inputWidth: null,
        labelAlign: 'left',
        required: false,
        children: null,
        style: {},
        title: '',
        splitter: ':'
    };

    render() {
        const { id, labelText, labelWidth, labelAlign, splitter, disabled, inputWidth, required, children, style, title, className } = this.props;
        const classes = classNames(
            styles.fieldWrapper,
            {
                [styles.required]: required,
                [styles.rightLabel]: labelAlign === 'right',
                [styles.disabled]: disabled,

            },
            className
        );
        return (
            <div
                className={classes}
                style={style}
                title={title || null}
            >
                <label
                    htmlFor={id}
                    className={styles.fieldLabel}
                    style={{ width: labelWidth }}
                >{`${labelText}${splitter}`}</label>
                <div
                    className={styles.fieldInput}
                    style={{ width: inputWidth }}
                >{children}</div>
            </div>
        );
    }
}

export default Field;
