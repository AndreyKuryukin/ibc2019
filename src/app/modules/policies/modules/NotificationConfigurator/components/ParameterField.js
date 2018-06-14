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
        onChange: PropTypes.func,
    };

    static defaultProps = {
        name: '',
        value: [],
        values: [],
        required: false,
        multiple: false,
        onChange: () => null,
    };

    static mapOptions = memoize(opts => opts.map(({ value, name }) => ({
        value,
        title: name,
    })));

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            emailError: null,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const isValueChanged = this.props.value !== nextProps.value || this.state.email !== nextState.email;
        const isEmailErrorChange = this.state.emailError !== nextState.emailError;

        return isValueChanged || isEmailErrorChange;
    }

    onChangeInput = (e) => {
        this.props.onChange(_.get(e, 'target.value', ''));
    };

    onChangeEmailValue = (email) => {
        this.setState({ email });
    };

    onAddEmail = (email) => {
        const reg = new RegExp(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        if (!reg.test(email)) {
            this.setState({ emailError: ls('POLICY_NOTIFICATIONS_INCORRECT_EMAIL', 'Некорректный e-mail') });
        } else if(this.props.value.includes(email)) {
            this.setState({ emailError: ls('POLICY_NOTIFICATIONS_DUPLICATE_EMAIL', 'E-mail уже добавлен') });
        } else {
            this.setState({ emailError: null }, () => {
                this.props.onChange([...this.props.value, email]);
            });
        }
    };

    onRemoveEmail = (email) => {
        this.props.onChange(_.without(this.props.value, email));
    };

    onSelectChange = (value) => {
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
                    value={value[0] || ''}
                    onChange={this.onChangeInput}
                />}
                {type === 'string' && (multiple ? (
                    <ChipList
                        onChange={this.onChangeEmailValue}
                        onAdd={this.onAddEmail}
                        value={this.state.email}
                        valid={!this.state.emailError}
                        error={this.state.emailError}
                    >
                        {value.map(email => (
                            <Chip
                                title={email}
                                key={email}
                                onRemove={this.onRemoveEmail.bind(this, email)}
                            />
                        ))}
                    </ChipList>
                ) : (
                    <Input
                        id={id}
                        value={value[0] || ''}
                        onChange={this.onChangeInput}
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
                    />
                ))}
            </Field>
        );
    }
}

export default ParameterField;
