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

const SCOPE_TYPES_NAMES_MAP = {
    SMART_SPY_SIMPLE: ls('AGGREGATION_FUNCTION_SMART_SPY_SIMPLE', 'Без функции агрегации'),
    SMART_SPY_ACC_DEVICE: ls('AGGREGATION_FUNCTION_SMART_SPY_ACC_DEVICE', 'Количество STB на оборудовании доступа'),
    SMART_SPY_AGG_DEVICE: ls('AGGREGATION_FUNCTION_SMART_SPY_AGG_DEVICE', 'Количество STB на оборудовании агрегации'),
    SMART_SPY_PE_DEVICE: ls('AGGREGATION_FUNCTION_SMART_SPY_PE_DEVICE', 'Количество STB на оборудовании PE'),
    SMART_SPY_PRC_ACC_DEVICE: ls('AGGREGATION_FUNCTION_SMART_SPY_PRC_ACC_DEVICE', '% STB на оборудовании доступа'),
    SMART_SPY_PRC_AGG_DEVICE: ls('AGGREGATION_FUNCTION_SMART_SPY_PRC_AGG_DEVICE', '% STB на оборудовании агрегации'),
    SMART_SPY_PRC_PE_DEVICE: ls('AGGREGATION_FUNCTION_SMART_SPY_PRC_PE_DEVICE', '% STB на оборудовании PE'),
    VB_UNICAST_SIMPLE: ls('AGGREGATION_FUNCTION_VB_UNICAST_SIMPLE', 'Unicast без функции агрегации'),
    VB_UNICAST_CHANNEL_COUNT: ls('AGGREGATION_FUNCTION_VB_UNICAST_CHANNEL_COUNT', 'Количество unicast-каналов на анализаторе'),
    VB_MULTICAST_SIMPLE: ls('AGGREGATION_FUNCTION_VB_MULTICAST_SIMPLE', 'Multicast без функции агрегации'),
    VB_MULTICAST_CHANNEL_COUNT: ls('AGGREGATION_FUNCTION_VB_MULTICAST_CHANNEL_COUNT', 'Количество mcast-каналов на анализаторе'),
    OTT_SIMPLE: ls('AGGREGATION_FUNCTION_OTT_SIMPLE', 'Без функции агрегации'),
    KQI_SIMPLE: ls('AGGREGATION_FUNCTION_KQI_SIMPLE', 'Без функции агрегации'),
};

class Configuration extends React.Component {
    static propTypes = {
        policy: PropTypes.object,
        setPolicyProperty: PropTypes.func,
        getThresholds: PropTypes.func,
        policyTypes: PropTypes.array,
        objectTypes: PropTypes.array,
        errors: PropTypes.object,
        metaData: PropTypes.object,
    };

    static defaultProps = {
        policy: null,
        setPolicyProperty: () => null,
        getThresholds: () => null,
        policyTypes: [],
        objectTypes: [],
        errors: PropTypes.object,
        metaData: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            policy: props.policy,
        };
    }

    shouldComponentUpdate(nextProps) {
        const isPolicyTypesChanged = this.props.policyTypes !== nextProps.policyTypes;
        const isObjectTypesChanged = this.props.objectTypes !== nextProps.objectTypes;
        const isErrorsChanged = this.props.errors !== nextProps.errors;
        const isMetaDataChanged = this.props.metaData !== nextProps.metaData;

        return isPolicyTypesChanged || isObjectTypesChanged || isErrorsChanged || isMetaDataChanged;
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.policy, nextProps.policy)) {
            this.setState({ policy: nextProps.policy });
        }
    }

    setPolicyProperty = (key, value) => {
        const policy = {
            ...this.state.policy,
            [key]: value
        };

        this.setState({ policy }, () => {
            this.props.setPolicyProperty(key, value);
        });
    };

    mapTypes = (types) => {
        console.log(types)
        return types.map(type => ({ value: type, title: SCOPE_TYPES_NAMES_MAP[type] || type }))
    };

    getSeconds = (mills) => {
        return moment.duration(mills, 'milliseconds').asSeconds() || '';
    };

    getMilliSeconds = (secs) => {
        return moment.duration(Number(secs), 'seconds').asMilliseconds() || '';
    };

    mapObjectTypes = objectTypes => _.isArray(objectTypes) ? objectTypes.map(type => ({
        title: type,
        value: type
    })) : [];

    render() {
        const { policyTypes, objectTypes, errors, metaData } = this.props;
        const threshold = _.get(metaData, 'threshold', false);
        const duration = _.get(metaData, 'duration', false);
        return (
            <Panel
                title={ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}
            >
                <Field
                    id="name"
                    labelText={`${ls('POLICIES_POLICY_FIELD_NAME', 'Имя')}`}
                    labelWidth="30%"
                    inputWidth="70%"
                    required
                >
                    <Input
                        itemId="policies_name_field"
                        id="name"
                        name="name"
                        placeholder={ls('POLICY_NAME_PLACEHOLDER', 'Имя')}
                        value={_.get(this.state.policy, 'name')}
                        onChange={value => this.setPolicyProperty('name', value)}
                        valid={errors && _.isEmpty(errors.name)}
                        maxLength={255}
                        errorMessage={_.get(errors, 'name.title')}
                    />
                </Field>
                <Field
                    id="object"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Тип объекта')}`}
                    labelWidth="30%"
                    inputWidth="70%"
                    required
                >
                    <Select
                        itemId="policies_object_field"
                        id="object"
                        type="select"
                        placeholder={ls('POLICY_OBJECT_TYPE_PLACEHOLDER', 'Тип объекта')}
                        value={_.get(this.state.policy, 'object_type') || ''}
                        options={this.mapObjectTypes(objectTypes)}
                        onChange={value => this.setPolicyProperty('object_type', value)}
                        valid={errors && _.isEmpty(errors.object_type)}
                        errorMessage={_.get(errors, 'object_type.title')}
                    />
                </Field>
                <Field
                    id="aggregation"
                    required
                    labelText={`${ls('POLICIES_POLICY_FIELD_AGGREGATION', 'Фукнция агрегации')}`}
                    labelWidth="30%"
                    inputWidth="70%"
                >
                    <Select
                        itemId="policies_aggregation_field"
                        id="aggregation"
                        type="select"
                        placeholder={ls('POLICIES_POLICY_FIELD_AGGREGATION', 'Функция агрегации')}
                        options={this.mapTypes(policyTypes)}
                        value={_.get(this.state.policy, 'policy_type') || ''}
                        onChange={policy_type => this.setPolicyProperty('policy_type', policy_type)}
                        valid={errors && _.isEmpty(errors.policy_type)}
                        errorMessage={_.get(errors, 'policy_type.title')}
                    />
                </Field>

                {(threshold || duration) &&
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <div style={{ width: '55%' }}>
                        <Field
                            id="rise_duration"
                            required
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_DURATION', 'Интервал агрегации')}`}
                            labelWidth="60%"
                            inputWidth="85px"
                        >
                            <div style={{ display: 'flex' }}>
                                <Input
                                    itemId="policies_rise_duration_field"
                                    id="rise_duration"
                                    type="number"
                                    name="rise_duration"
                                    placeholder="0"
                                    valid={_.isEmpty(_.get(errors, 'threshold.rise_duration'))}
                                    value={this.getSeconds(_.get(this.state.policy, 'threshold.rise_duration', ''))}
                                    onChange={value => this.setPolicyProperty('threshold.rise_duration', this.getMilliSeconds(value))}
                                    maxLength={6}
                                    errorMessage={_.get(errors, 'threshold.rise_duration.title')}
                                />
                                <span style={unitStyle}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                            </div>
                        </Field>
                    </div>
                    <div style={{ width: '45%' }}>
                        {threshold && <Field
                            id="rise_value"
                            required
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_VALUE', 'Порог')}`}
                            labelWidth="35%"
                            inputWidth="85px"
                            style={thresholdFieldStyle}
                        >
                            <div style={{ display: 'flex' }}>
                                <Input
                                    itemId="policies_rise_value_field"
                                    id="rise_value"
                                    type="number"
                                    name="rise_value"
                                    placeholder="0"
                                    valid={_.isEmpty(_.get(errors, 'threshold.rise_value'))}
                                    value={this.props.getThresholds('threshold.rise_value', '')}
                                    onChange={value => this.setPolicyProperty('threshold.rise_value', value)}
                                    maxLength={6}
                                    errorMessage={_.get(errors, 'threshold.rise_value.title')}
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
                        itemId="policies_message_field"
                        id="message"
                        type="textarea"
                        placeholder={ls('POLICIES_POLICY_FIELD_MESSAGE', 'Текст сообщения')}
                        value={_.get(this.state.policy, 'notification_template', '') || ''}
                        onChange={value => this.setPolicyProperty('notification_template', value)}
                        rows={5}
                        errorMessage={_.get(errors, 'notification_template.title')}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Configuration;
