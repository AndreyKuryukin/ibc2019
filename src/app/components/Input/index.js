import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
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
    value: PropTypes.string,
    allowDecimal: PropTypes.bool,
    allowNegative: PropTypes.bool,
};

const defaultProps = {
    type: 'text',
    value: '',
    allowDecimal: false,
    allowNegative: false,
};

const style = {
    position: 'relative',
};

class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({ value: nextProps.value });
        }
    }

    onChange = (e) => {
        const value = e.target.value;
        const { type, allowNegative } = this.props;
        const isValidValue = type !== 'number' || ((value === '-' && allowNegative) || !isNaN(+value));

        if (isValidValue) {
            this.setState({ value }, () => {
                this.props.onChange(value);
            });
        }
    };


    validateNumKey = (e) => {
        const { allowDecimal, allowNegative } = this.props;
        let isKeyAllowed = e.charCode >= 48 && e.charCode <= 57;
        if (allowDecimal) {
            isKeyAllowed = isKeyAllowed || e.charCode === 46;
        }
        if (allowNegative) {
            isKeyAllowed = isKeyAllowed || e.charCode === 45;
        }

        if (!isKeyAllowed) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

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

        if (type === 'number') {
            attributes.type = 'text';
            attributes.onKeyPress = this.validateNumKey;
        }

        return (
            <div style={style} className={className}>
                {valid === false && <div className={'fieldInvalid'} title={errorMessage}/>}
            <Tag
                {...attributes}
                value={this.state.value}
                ref={innerRef}
                className={classes}
                onChange={this.onChange}
            />
            </div>
        );
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;