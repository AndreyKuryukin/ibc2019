import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import { SERVICE_TYPES } from '../constants';

class BasicParams extends React.PureComponent {
    static propTypes = {
        serviceTypesOptions: PropTypes.array,
        kqiOptions: PropTypes.array,
        onServiceTypeChange: PropTypes.func,
        onKQIChange: PropTypes.func,
    };

    static defaultProps = {
        serviceTypesOptions: [],
        kqiOptions: [],
        onServiceTypeChange: () => null,
        onKQIChange: () => null,
    };

    render() {
        return (
            <Panel
                title={ls('KQI_CALCULATOR_BASIC_PARAMETERS_TITLE', 'Основные параметры')}
            >
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
                    />
                </Field>
            </Panel>
        );
    }
}

export default BasicParams;
