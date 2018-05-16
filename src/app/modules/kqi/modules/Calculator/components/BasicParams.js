import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import Input from '../../../../../components/Input';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';

import styles from './styles.scss';

class BasicParams extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        config: PropTypes.object,
        kqiOptions: PropTypes.array,
        serviceTypesOptions: PropTypes.array,
        errors: PropTypes.object,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        onChange: () => null,
        kqiOptions: [],
        serviceTypesOptions: [],
        config: null,
        errors: null,
        disabled: false,
    };


    render() {
        const { errors, disabled, config, kqiOptions } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_BASIC_PARAMETERS_TITLE', 'Основные параметры')}
            >
                <Field
                    id="name"
                    labelText={ls('KQI_CALCULATOR_NAME_FIELD_LABEL', 'Название')}
                    labelWidth="20%"
                    inputWidth="80%"
                    required
                >
                    {_.get(config, 'period.auto') ?
                        <div className={styles.displayField}>{_.get(config, 'name')}</div> : <Input
                            id="name"
                            value={_.get(config, 'name')}
                            onChange={event => this.props.onChange('name', event.currentTarget.value)}
                            valid={errors && _.isEmpty(errors.name)}
                            disabled={disabled}
                        />}
                </Field>
                <Field
                    id="service-type"
                    labelText={ls('KQI_CALCULATOR_SERVICE_FIELD_LABEL', 'Услуга')}
                    labelWidth="20%"
                    inputWidth="80%"
                >
                    <Select
                        id="service-type"
                        placeholder={ls('KQI_CALCULATOR_SERVICE_FIELD_PLACEHOLDER', 'Выберите услугу')}
                        value={_.get(config, 'service_type')}
                        options={this.props.serviceTypesOptions}
                        onChange={value => this.props.onChange('service_type', value)}
                        disabled={disabled}
                    />
                </Field>
                <Field
                    id="kqi"
                    labelText={ls('KQI_CALCULATOR_KQI_FIELD_LABEL', 'KQI')}
                    labelWidth="20%"
                    inputWidth="80%"
                    required
                >
                    <Select
                        id="kqi"
                        placeholder={ls('KQI_CALCULATOR_KQI_FIELD_PLACEHOLDER', 'Выберите KQI')}
                        options={kqiOptions}
                        value={_.get(config, 'kqi_id')}
                        onChange={value => this.props.onChange('kqi_id', value)}
                        valid={errors && _.isEmpty(errors.kqi_id)}
                        disabled={disabled}
                    />
                </Field>
            </Panel>
        );
    }
}

export default BasicParams;
