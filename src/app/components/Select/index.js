import React from 'react';
import _ from 'lodash';
import { Input } from 'reactstrap';
import styles from './styles.scss';
import classnames from "classnames";
import ls from 'i18n';
import onClickOutside from "react-onclickoutside";

const PLACEHOLDER_VALUE = `placeholder-${(new Date()).getTime()}`;

class Select extends React.PureComponent {

    static defaultProps = {
        options: [],
        noEmptyOption: false,
        errorMessage: ls('DEFAULT_ERROR_MSG', 'Это поле заполнено неверно'),
        valid: true,
        onChange: () => null,
        value: '',
    };

    constructor() {
        super();
        this.state = {
            isOptionsDisplayed: false,
        };
    }

    onSelectOption = (value) => {
        if (value === PLACEHOLDER_VALUE) {
            this.setState({ value: '' }, () => {
                this.props.onChange('');
            });
            // Если будут баги, можно удалить if после else
        } else if (this.getValue() !== value) {
            this.setState({ value: value }, () => {
                this.props.onChange(value);
            });
        }
    };

    renderPlaceholder = (placeholder) => <option key="placeholder"
                                                 className={styles.placeholder}
                                                 value={PLACEHOLDER_VALUE}>{placeholder}</option>;

    renderOptions = (options) => options.map((opt, index) => <option key={index}
                                                                     className={styles.option}
                                                                     value={opt.value}>{opt.title}</option>);

    getValue = () => {
        const propsValue = this.props.value;
        const stateValue = this.state.value;
        return _.isUndefined(propsValue) ? stateValue : propsValue;
    };

    onClick = () => {
        const actionMethod = this.state.isOptionsDisplayed ? 'blur' : 'focus';
        this.setState({ isOptionsDisplayed: !this.state.isOptionsDisplayed });
        this.select[actionMethod]();
    }

    handleClickOutside = () => {
        if (this.state.isOptionsDisplayed) {
            this.setState({ isOptionsDisplayed: false });
            this.select.blur();
        }
    };

    render() {
        const { placeholder, errorMessage, options, noEmptyOption, children, valid, ...rest } = this.props;
        const value = this.getValue();
        const invalid = valid !== null && !valid;
        const placeholderClass =  value === '' ? styles.placeholder : '';
        if (!_.isEmpty(children)) {
            console.info('Select should not has children')
        }
        return (
            <div className={styles.selectWrapper} onClick={this.onClick}>
                {valid === false &&
                <div className={classnames('fieldInvalid', styles.errorMark)} title={errorMessage}/>}
                <Input type="select" {...rest}
                       value={value}
                       className={placeholderClass}
                       invalid={invalid}
                       innerRef={select => this.select = select}
                >
                    {!noEmptyOption && this.renderPlaceholder(placeholder)}
                    {this.renderOptions(options)}
                </Input>
                <ul
                    className={styles.optionsList}
                    style={{
                        display: this.state.isOptionsDisplayed ? 'flex' : 'none',
                    }}
                >
                    {!noEmptyOption && (
                        <li
                            key="options-item-placeholder"
                            className={styles.placeholder}
                            onClick={() => this.onSelectOption(PLACEHOLDER_VALUE)}
                        >{placeholder}</li>
                    )}
                    {options.map((opt, index) => (
                        <li
                            key={`options-item-${index}`}
                            onClick={() => this.onSelectOption(opt.value)}
                            title={opt.title}
                        >{opt.title}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default onClickOutside(Select);
