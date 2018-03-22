import React from 'react';
import _ from 'lodash';
import { Input } from 'reactstrap';
import styles from './styles.scss';

const PLACEHOLDER_VALUE = `placeholder-${(new Date()).getTime()}`;

class RoleEditor extends React.PureComponent {

    static defaultProps = {
        options: [],
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
        const { placeholder, defaultValue, options, children, ...rest } = this.props;
        const value = this.getValue();
        if (!_.isEmpty(children)) {
            console.info('Select should not has children')
        }
        return (
            <div className={styles.selectWrapper}>
                <Input type="select" {...rest}
                    value={value}
                    onChange={this.onChange}
                    className={(this.state.defaultSelected || _.isUndefined(value)) && styles.placeholder}
                >
                    {this.renderPlaceholder(placeholder, _.isUndefined(value))}
                    {this.renderOptions(options)}
                </Input>
            </div>
        );
    }
}

export default RoleEditor;
