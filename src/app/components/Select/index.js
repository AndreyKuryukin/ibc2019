import React from 'react';
import _ from 'lodash';
import { Input } from 'reactstrap';
import styles from './styles.scss';
import classnames from "classnames";

const PLACEHOLDER_VALUE = `placeholder-${(new Date()).getTime()}`;

class Select extends React.PureComponent {

    static defaultProps = {
        options: [],
        noEmptyOption: false,
        defaultValue: null,
        onChange: () => null,
    };

    constructor() {
        super();
        this.state = {};
    }

    onChange = (event) => {
        const value = event.currentTarget.value;
        if (value === PLACEHOLDER_VALUE) {
            this.setState({ defaultSelected: true, value: null });
            this.props.onChange(null);
        } else {
            this.setState({ defaultSelected: false, value: value });
            this.props.onChange(value);
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

    render() {
        const { placeholder, options, noEmptyOption, children, valid, errorMessage, ...rest } = this.props;
        const value = this.getValue() || PLACEHOLDER_VALUE;
        if (!_.isEmpty(children)) {
            console.info('Select should not has children')
        }
        return (
            <div className={styles.selectWrapper}>
                {valid === false && <div className={classnames('fieldInvalid', styles.errorMark)} title={errorMessage}/>}
                <Input type="select" {...rest}
                       value={value}
                       onChange={this.onChange}
                       invalid={valid === false}
                       className={classnames({
                           [styles.placeholder]: (value === PLACEHOLDER_VALUE || _.isUndefined(value)),
                       })}
                >
                    {!noEmptyOption && this.renderPlaceholder(placeholder, _.isUndefined(value))}
                    {this.renderOptions(options)}
                </Input>
            </div>
        );
    }
}

export default Select;
