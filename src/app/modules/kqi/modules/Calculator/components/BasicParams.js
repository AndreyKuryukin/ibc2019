import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import Input from '../../../../../components/Input';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';

class BasicParams extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string,
        serviceTypesOptions: PropTypes.array,
        kqiOptions: PropTypes.array,
        onNameChange: PropTypes.func,
        onServiceTypeChange: PropTypes.func,
        onKQIChange: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        name: '',
        serviceTypesOptions: [],
        kqiOptions: [],
        onNameChange: () => null,
        onServiceTypeChange: () => null,
        onKQIChange: () => null,
        errors: null,
    };

    render() {
        const { errors } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_BASIC_PARAMETERS_TITLE', 'Основные параметры')}
            >
                <Field
                    id="name"
                    labelText={`${ls('KQI_CALCULATOR_NAME_FIELD_LABEL', 'Название')}:`}
                    labelWidth="20%"
                    inputWidth="80%"
                    required
                >
                    <Input
                        id="name"
                        value={this.props.name}
                        onChange={event => this.props.onNameChange(event.currentTarget.value)}
                        valid={errors && _.isEmpty(errors.name)}
                    />
                </Field>
                <Field
                    id="service-type"
                    labelText={`${ls('KQI_CALCULATOR_SERVICE_FIELD_LABEL', 'Услуга')}:`}
                    labelWidth="20%"
                    inputWidth="80%"
                >
                    <Select
                        id="service-type"
                        options={this.props.serviceTypesOptions}
                        onChange={this.props.onServiceTypeChange}
                    />
                </Field>
                <Field
                    id="kqi"
                    labelText={`${ls('KQI_CALCULATOR_KQI_FIELD_LABEL', 'KQI')}:`}
                    labelWidth="20%"
                    inputWidth="80%"
                    required
                >
                    <Select
                        id="kqi"
                        options={this.props.kqiOptions}
                        onChange={this.props.onKQIChange}
                        valid={errors && _.isEmpty(errors.kqi_id)}
                    />
                </Field>
            </Panel>
        );
    }
}

export default BasicParams;
