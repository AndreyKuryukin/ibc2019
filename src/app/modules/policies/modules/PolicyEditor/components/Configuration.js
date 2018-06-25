import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import Panel from '../../../../../components/Panel';
import ls from 'i18n';

const unitStyle = { margin: '3px 0px 3px 2px' };
const textareaStyle = { marginTop: 10 };
const thresholdFieldStyle = { flexGrow: 1, justifyContent: 'flex-end' };

class Configuration extends React.PureComponent {
    static propTypes = {
        getPolicyProperty: PropTypes.func,
        setPolicyProperty: PropTypes.func,
        policyTypes: PropTypes.array,
        objectTypes: PropTypes.array,
        errors: PropTypes.object,
        metaData: PropTypes.object,
    };

    static defaultProps = {
        getPolicyProperty: () => null,
        setPolicyProperty: () => null,
        policyTypes: [],
        objectTypes: [],
        errors: PropTypes.object,
        metaData: PropTypes.object,
    };

    mapTypes = (types) => {
        return types.map(type => ({ value: type, title: type }))
    };

    getSeconds = (mills) => {
        return moment.duration(mills, 'milliseconds').asSeconds() || '';
    };

    getMilliSeconds = (secs) => {
        return moment.duration(Number(secs), 'seconds').asMilliseconds();
    };

    mapObjectTypes = objectTypes => objectTypes.map(type => ({ title: type, value: type }));

    validateNumKey = (e) => {
        const isKeyAllowed = e.charCode >= 48 && e.charCode <= 57;

        if (!isKeyAllowed) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    render() {
        const { getPolicyProperty, setPolicyProperty, policyTypes, objectTypes, errors, metaData } = this.props;
        const object_type = getPolicyProperty('object_type');
        return (
            <Panel
                title={ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}
            >
                <Field
                    id="name"
                    labelText={`${ls('POLICIES_POLICY_FIELD_NAME', 'Имя')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                    required
                >
                    <Input
                        id="name"
                        name="name"
                        placeholder={ls('POLICY_NAME_PLACEHOLDER', 'Имя')}
                        value={getPolicyProperty('name')}
                        onChange={event => setPolicyProperty('name', _.get(event, 'target.value'))}
                        valid={errors && _.isEmpty(errors.name)}
                        maxLength={255}
                    />
                </Field>
                <Field
                    id="object"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Тип объекта')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                    required
                >
                    <Select
                        id="object"
                        type="select"
                        placeholder={ls('POLICY_OBJECT_TYPE_PLACEHOLDER', 'Тип объекта')}
                        value={getPolicyProperty('object_type') || undefined}
                        options={this.mapObjectTypes(objectTypes)}
                        onChange={value => setPolicyProperty('object_type', value, true)}
                        valid={errors && _.isEmpty(errors.objectType)}
                    />
                </Field>
                <Field
                    id="aggregation"
                    required
                    labelText={`${ls('POLICIES_POLICY_FIELD_AGGREGATION', 'Фукнция агрегации')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    <Select
                        id="aggregation"
                        type="select"
                        placeholder={ls('POLICY_AGGREGATION_PLACEHOLDER', 'Функция агрегации')}
                        options={this.mapTypes(policyTypes)}
                        value={getPolicyProperty('policy_type') || undefined}
                        onChange={policy_type => setPolicyProperty('policy_type', policy_type)}
                        valid={errors && _.isEmpty(errors.policy_type)}
                    />
                </Field>

                {object_type !== 'KQI' && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <div style={{ width: '60%' }}>
                        <Field
                            id="rise_duration"
                            required
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_DURATION', 'Интервал агрегации')}`}
                            labelWidth="60%"
                            inputWidth="85px"
                        >
                            <div style={{ display: 'flex' }}>
                                <Input
                                    id="rise_duration"
                                    name="rise_duration"
                                    placeholder="0"
                                    valid={_.isEmpty(_.get(errors, 'threshold.rise_duration'))}
                                    value={this.getSeconds(getPolicyProperty('threshold.rise_duration'))}
                                    onKeyPress={this.validateNumKey}
                                    onChange={event => setPolicyProperty('threshold.rise_duration', this.getMilliSeconds(_.get(event, 'currentTarget.value')))}
                                    maxLength={6}
                                />
                                <span style={unitStyle}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                            </div>
                        </Field>
                    </div>
                    <div style={{ width: '40%' }}>
                        {_.get(metaData, 'group') !== 'SIMPLE' && <Field
                            id="rise_value"
                            required
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_VALUE', 'Порог')}`}
                            labelWidth="35%"
                            inputWidth="85px"
                            style={thresholdFieldStyle}
                        >
                            <div style={{ display: 'flex' }}>
                                <Input
                                    id="rise_value"
                                    name="rise_value"
                                    placeholder="0"
                                    valid={_.isEmpty(_.get(errors, 'threshold.rise_value'))}
                                    value={this.getSeconds(getPolicyProperty('threshold.rise_value'))}
                                    onKeyPress={this.validateNumKey}
                                    onChange={event => setPolicyProperty('threshold.rise_value', this.getMilliSeconds(_.get(event, 'currentTarget.value')))}
                                    maxLength={6}
                                />
                                <span style={unitStyle}>{ls('TRESHOLD_UNIT', 'ед.')}</span>
                            </div>
                        </Field>}
                    </div>
                </div>}

                <Field
                    id="message"
                    labelText={`${ls('POLICIES_POLICY_FIELD_MESSAGE', 'Текст сообщения')}`}
                    labelWidth="100%"
                    inputWidth="100%"
                    labelAlign="right"
                    style={textareaStyle}
                >
                    <Input
                        id="message"
                        type="textarea"
                        placeholder={ls('POLICY_AGGREGATION_PLACEHOLDER', 'Текст сообщения')}
                        value={getPolicyProperty('notification_template')}
                        onChange={(event) => {
                            setPolicyProperty('notification_template', _.get(event, 'target.value'))
                        }}
                        rows={5}
                    />
                </Field>
            </Panel>
        )
    }
}

export default Configuration;
