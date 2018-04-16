import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import Panel from '../../../../../components/Panel';
import ls from 'i18n';

class Configuration extends React.PureComponent {
    static propTypes = {
        getPolicyProperty: PropTypes.func,
        setPolicyProperty: PropTypes.func,
        types: PropTypes.array,
        errors: PropTypes.object,
    };

    static defaultProps = {
        getPolicyProperty: () => null,
        setPolicyProperty: () => null,
        types: [],
        errors: PropTypes.object,
    };

    mapTypes = (types) => {
        return types.map(type => ({ value: type, title: type }))
    };

    getSeconds = (mills) => {
        return moment.duration(mills, 'milliseconds').asSeconds();
    };

    getMilliSeconds = (secs) => {
        return moment.duration(secs, 'seconds').asMilliseconds();
    };


    render() {
        const { getPolicyProperty, setPolicyProperty, types, errors } = this.props;
        return (
            <Panel
                title={ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}
            >
                <Field
                    id="name"
                    labelText={`${ls('POLICIES_POLICY_FIELD_NAME', 'Имя')}:`}
                    labelWidth="50%"
                    inputWidth="50%"
                    required
                >
                    <Input
                        id="name"
                        name="name"
                        value={getPolicyProperty('name')}
                        onChange={event => setPolicyProperty('name', _.get(event, 'target.value'))}
                        valid={errors && _.isEmpty(errors.name)}
                    />
                </Field>
                <Field
                    id="aggregation"
                    required
                    labelText={`${ls('POLICIES_POLICY_FIELD_AGGREGATION', 'Фукнция агрегации')}:`}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    <Select
                        id="aggregation"
                        type="select"
                        options={this.mapTypes(types)}
                        value={getPolicyProperty('policy_type')}
                        onChange={policy_type => setPolicyProperty('policy_type', policy_type)}
                        valid={errors && _.isEmpty(errors.policy_type)}
                    />
                </Field>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <div style={{ flex: 3 }}>
                        <Field
                            id="rise_duration"
                            required
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_DURATION', 'Интервал агрегации')}:`}
                            labelWidth="67%"
                            inputWidth="70px"
                        >
                            <div style={{ display: 'flex' }}>
                                <Input
                                    id="rise_duration"
                                    type="number"
                                    name="rise_duration"
                                    valid={_.isEmpty(_.get(errors, 'threshold.rise_duration'))}
                                    value={this.getSeconds(getPolicyProperty('threshold.rise_duration'))}
                                    onChange={event => setPolicyProperty('threshold.rise_duration', this.getMilliSeconds(_.get(event, 'target.value')))}
                                />
                                <span style={{ margin: '2px' }}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                            </div>
                        </Field>
                    </div>
                    <div style={{ flex: 2 }}>
                        <Field
                            id="rise_value"
                            required
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_VALUE', 'Порог')}:`}
                            labelWidth="50%"
                            inputWidth="70px"
                        >
                            <div style={{ display: 'flex' }}>
                                <Input
                                    id="rise_value"
                                    type="number"
                                    name="rise_value"
                                    valid={_.isEmpty(_.get(errors, 'threshold.rise_value'))}
                                    value={this.getSeconds(getPolicyProperty('threshold.rise_value'))}
                                    onChange={event => setPolicyProperty('threshold.rise_value', this.getMilliSeconds(_.get(event, 'target.value')))}
                                />
                                <span style={{ margin: '2px' }}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                            </div>
                        </Field>
                    </div>
                </div>
                <Field
                    id="message"
                    labelText={`${ls('POLICIES_POLICY_FIELD_MESSAGE', 'Текст сообщения')}:`}
                    labelWidth="100%"
                    inputWidth="100%"
                    labelAlign="right"
                    style={{ marginTop: 10 }}
                >
                    <Input
                        id="message"
                        type="textarea"
                        value={getPolicyProperty('notification_template')}
                        onChange={(event) => {
                            setPolicyProperty('notification_template', _.get(event, 'target.value'))
                        }}
                    />
                </Field>
            </Panel>
        )
    }
}

export default Configuration;
