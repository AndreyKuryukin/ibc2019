import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import memoize from 'memoizejs';
import Select from '../../../../../components/Select';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import { Chip, ChipList } from '../../../../../components/Chip';
import MultiselectGrid from './MultiselectGrid';
import styles from './styles.scss';

class ParameterField extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['string', 'integer', 'enum']).isRequired,
        name: PropTypes.string,
        value: PropTypes.array,
        values: PropTypes.array,
        required: PropTypes.bool,
        multiple: PropTypes.bool,
        matcher: PropTypes.object,
        errors: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        name: '',
        value: [],
        values: [],
        required: false,
        multiple: false,
        matcher: null,
        errors: null,
        onChange: () => null,
    };

    static mapOptions = memoize(opts => opts.map(({ value, name }) => ({
        value,
        title: name,
    })));

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            error: null,
            errors: props.errors,
        };
    }

   componentWillReceiveProps(nextProps) {
        if (this.props.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
   }

    shouldComponentUpdate(nextProps, nextState) {
        const isValueChanged = this.props.value !== nextProps.value || this.state.value !== nextState.value;
        const isErrorChange = this.state.error !== nextState.error;
        const isErrorsChanged = this.props.errors !== nextProps.errors;

        return isValueChanged || isErrorChange || isErrorsChanged;
    }

    onChangeInput = (value) => {
        this.props.onChange(value);

        if (value) {
            this.setState({ errors: null });
        }
    };

    onChangeValue = (value) => {
        this.setState({ value });
    };

    onAddValue = (value) => {
        if (this.props.matcher) {
            const reg = new RegExp(
                this.props.matcher
            );

            if (!reg.test(value)) {
                this.setState({ error: ls('POLICY_NOTIFICATIONS_INCORRECT_VALUE', 'Некорректное значение') });
            } else if(this.props.value.includes(value)) {
                this.setState({ error: ls('POLICY_NOTIFICATIONS_DUPLICATE_VALUE', 'Такое значение уже добавлено') });
            } else {
                this.setState({ error: null }, () => {
                    this.props.onChange([...this.props.value, value]);
                });
            }
        }
    };

    onRemoveValue = (value) => {
        this.props.onChange(_.without(this.props.value, value));
    };

    onSelectChange = (value) => {
        if (value) {
            this.setState({ errors: null });
        }
        this.props.onChange([value]);
    }

    render() {
        const {
            id,
            type,
            name,
            value,
            values,
            required,
            multiple,
            onChange,
        } = this.props;

        const { errors } = this.state;

        return (
            <Field
                id={id}
                className={styles.policyNotificationParam}
                labelText={name}
                inputWidth="70%"
                labelWidth="30%"
                required={required}
            >
                {type === 'integer' && <Input
                    id={id}
                    type="number"
                    value={value[0] || ''}
                    onChange={this.onChangeInput}
                    placeholder={name}
                />}
                {type === 'string' && (multiple ? (
                    <ChipList
                        id={id}
                        onChange={this.onChangeValue}
                        onAdd={this.onAddValue}
                        value={this.state.value}
                        valid={!this.state.error}
                        error={this.state.error}
                        placeholder={name}
                    >
                        {value.map(val => (
                            <Chip
                                title={val}
                                key={val}
                                onRemove={this.onRemoveValue.bind(this, val)}
                            />
                        ))}
                    </ChipList>
                ) : (
                    <Input
                        id={id}
                        value={value[0] || ''}
                        onChange={this.onChangeInput}
                        placeholder={name}
                        maxLength={255}
                    />
                ))}
                {type === 'enum' && (multiple ? (
                    <MultiselectGrid
                        id={id}
                        values={values}
                        checked={value}
                        onChange={onChange}
                    />
                ) : (
                    <Select
                        id={id}
                        options={ParameterField.mapOptions(values)}
                        value={value[0] || ''}
                        onChange={this.onSelectChange}
                        placeholder={name}
                        errorMessage={_.get(errors, `${name}.title`, '')}
                        valid={_.isEmpty(errors)}
                    />
                ))}
            </Field>
        );
    }
}

export default ParameterField;
