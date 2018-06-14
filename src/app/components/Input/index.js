import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import styles from './styles.scss';
import ls from "i18n";

const propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    size: PropTypes.string,
    bsSize: PropTypes.string,
    valid: PropTypes.bool,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    plaintext: PropTypes.bool,
    addon: PropTypes.bool,
    className: PropTypes.string,
    cssModule: PropTypes.object,
};

const defaultProps = {
    type: 'text',
};

const style = {
    position: 'relative',
};

class Input extends React.Component {
    render() {
        let {
            className,
            cssModule,
            type,
            bsSize,
            state,
            valid,
            tag,
            addon,
            static: staticInput,
            plaintext,
            innerRef,
            errorMessage = ls('DEFAULT_ERROR_MSG', 'Это поле заполнено неверно'),
            ...attributes
        } = this.props;

        const checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
        const isNotaNumber = new RegExp('\\D', 'g');

        const fileInput = type === 'file';
        const textareaInput = type === 'textarea';
        const selectInput = type === 'select';
        let Tag = tag || ((selectInput || textareaInput) ? type : 'input');

        let formControlClass = 'form-control';

        if (plaintext || staticInput) {
            formControlClass = `${formControlClass}-plaintext`;
            Tag = tag || 'p';
        } else if (fileInput) {
            formControlClass = `${formControlClass}-file`;
        } else if (checkInput) {
            if (addon) {
                formControlClass = null;
            } else {
                formControlClass = 'form-check-input';
            }
        }

        if (state && typeof valid === 'undefined') {
            if (state === 'danger') {
                valid = false;
            } else if (state === 'success') {
                valid = true;
            }
        }

        if (attributes.size && isNotaNumber.test(attributes.size)) {
            bsSize = attributes.size;
            delete attributes.size;
        }

        const classes = mapToCssModules(classNames(
            className,
            valid === false && 'is-invalid',
            valid && 'is-valid',
            bsSize ? `form-control-${bsSize}` : false,
            formControlClass
        ), cssModule);

        if (Tag === 'input' || typeof tag !== 'string') {
            attributes.type = type;
        }

        return (
            <div style={style} className={className}>
                {valid === false && <div className={'fieldInvalid'} title={errorMessage}/>}
            <Tag {...attributes} ref={innerRef} className={classes} />
            </div>
        );
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;