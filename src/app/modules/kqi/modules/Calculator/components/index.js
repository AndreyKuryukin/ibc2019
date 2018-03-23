import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from "../../../../../components/Field";
import Checkbox from "../../../../../components/Checkbox";
import DatePicker from "../../../../../components/DateTimePicker";
import styles from './styles.scss';
import {
    ABONENT_GROUP_GROUPING,
    DATE_TIME_GROUPING,
    EQUIPMENT_TYPE_GROUPING,
    GROUPING_TYPES,
    LAST_INCH_TECHNOLOGIES,
    LAST_MILE_TECHNOLOGIES,
    LOCATION_GROUPING,
    SERVICE_TYPES,
} from '../constants';

class Calculator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        kqiList: PropTypes.array,
        locationsList: PropTypes.array,
        manufactureList: PropTypes.array,
        equipmentsList: PropTypes.array,
        usergroupsList: PropTypes.array,
        onSubmit: PropTypes.func.isRequired,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        kqiList: [],
        locationsList: [],
        manufactureList: [],
        equipmentsList: [],
        usergroupsList: [],
        onSubmit: () => null,
        onMount: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            config: {
                name: '',
                description: '',
                service_type: '',
                start_date_time: null,
                end_date_time: null,
                location: '',
                last_mile_technology: '',
                last_inch_technology: '',
                manufacture: '',
                equipment_type: '',
                abonent_group: '',
                kqi_config_id: null,
            },
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    static mapObjectToOptions(object) {
        return _.map(object, (title, value) => ({ value, title }));
    }

    static mapListToOptions = createSelector(
        (props, listName) => _.get(props, `${listName}`, []),
        list => list.map((item) => {
            if (typeof item === 'string') return { value: item, title: item };
            if (typeof item === 'object') return { value: item.id, title: item.name };
        }),
    );

    setConfigProperty = (key, value) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };

        this.setState({ config });
    };

    setGroupingProperty = (prop, key, checked) => {
        const updated = checked
            ? [..._.get(this.state.config, `${prop}`, []), key]
            : _.without(_.get(this.state.config, `${prop}`, []), key);

        this.setConfigProperty(prop, updated);
    };

    onClose = () => {
        this.context.history.push('/kqi');
    };

    onSubmit = () => {
        const { config } = this.state;
        const preparedConfig = {
            ...config,
            date_time_grouping: _.get(config, 'date_time_grouping') ? [_.get(config, 'date_time_grouping')] : [GROUPING_TYPES.NONE],
            location_grouping: _.get(config, 'location_grouping') ? [_.get(config, 'location_grouping')] : [GROUPING_TYPES.NONE],
            last_mile_technology_grouping: _.get(config, 'last_mile_technology_grouping') ? [GROUPING_TYPES.SELF] : [GROUPING_TYPES.NONE],
            last_inch_technology_grouping: _.get(config, 'last_inch_technology_grouping', false) ? [GROUPING_TYPES.SELF] : [GROUPING_TYPES.NONE],
            manufacture_grouping: _.get(config, 'manufacture_grouping', false) ? [GROUPING_TYPES.SELF] : [GROUPING_TYPES.NONE],
            equipment_grouping: _.get(config, 'equipment_grouping', []).length > 0 ? _.get(config, 'equipment_grouping') : [GROUPING_TYPES.NONE],
            abonent_grouping: _.get(config, 'abonent_grouping', []).length > 0 ? _.get(config, 'abonent_grouping') : [GROUPING_TYPES.NONE],
        };
        this.props.onSubmit(preparedConfig);
    };

    getPanelsConfig = () => [{
        title: ls('KQI_CALCULATOR_BASIC_PARAMETERS_TITLE', 'Основные параметры'),
        fields: [{
            id: 'service-type',
            labelText: `${ls('KQI_CALCULATOR_SERVICE_FIELD_LABEL', 'Услуга')}:`,
            labelWidth: '20%',
            inputWidth: '80%',
            required: true,
            children: (
                <Select
                    id="service-type"
                    options={Calculator.mapObjectToOptions(SERVICE_TYPES)}
                    onChange={value => this.setConfigProperty('service_type', value)}
                />
            ),
        }, {
            id: 'kqi',
            labelText: `${ls('KQI_CALCULATOR_KQI_FIELD_LABEL', 'KQI')}:`,
            labelWidth: '20%',
            inputWidth: '80%',
            required: true,
            children: (
                <Select
                    id="kqi"
                    options={Calculator.mapListToOptions(this.props, 'kqiList')}
                    onChange={value => this.setConfigProperty('kqi_config_id', value)}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_SETTINGS_TITLE', 'Настройки'),
        horizontal: true,
        fields: [{
            id: 'time-interval',
            labelText: `${ls('KQI_CALCULATOR_TIME_INTERVAL_FIELD_LABEL', 'Временной интервал')}:`,
            labelWidth: '32%',
            inputWidth: '68%',
            required: true,
            style: {
                flex: '1 1 0',
            },
            children: (
                <div style={{ display: 'flex' }}>
                    <DatePicker
                        value={_.get(this.state.config, 'start_date_time', null)}
                        onChange={value => this.setConfigProperty('start_date_time', value)}
                        inputWidth={90}
                        format={'DD.MM.YYYY HH:mm'}
                        time
                    />
                    <DatePicker
                        value={_.get(this.state.config, 'end_date_time', null)}
                        min={_.get(this.state.config, 'start_date_time', null)}
                        onChange={value => this.setConfigProperty('end_date_time', value)}
                        inputWidth={90}
                        format={'DD.MM.YYYY HH:mm'}
                        style={{ marginLeft: 5 }}
                        time
                    />
                </div>
            ),
        }, {
            id: 'date-time-grouping',
            labelText: `${ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}:`,
            labelWidth: '32%',
            inputWidth: '68%',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Select
                    id="date-time-grouping"
                    options={Calculator.mapObjectToOptions(DATE_TIME_GROUPING)}
                    onChange={value => this.setConfigProperty('date_time_grouping', value)}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_LOCATION_TITLE', 'Расположение'),
        horizontal: true,
        fields: [{
            id: 'location',
            labelText: `${ls('KQI_CALCULATOR_LOCATION_FIELD_LABEL', 'Местоположение')}:`,
            labelWidth: '32%',
            inputWidth: '66%',
            required: true,
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="location"
                    options={Calculator.mapListToOptions(this.props, 'locationsList')}
                    onChange={value => this.setConfigProperty('location', value)}
                />
            ),
        }, {
            id: 'location-grouping',
            labelText: `${ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}:`,
            labelWidth: '32%',
            inputWidth: '68%',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Select
                    id="location-grouping"
                    options={Calculator.mapObjectToOptions(LOCATION_GROUPING)}
                    onChange={value => this.setConfigProperty('location_grouping', value)}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_LAST_MILE_TECHNOLOGY_TITLE', 'Тип технологии ПМ'),
        horizontal: true,
        fields: [{
            id: 'last-mile-technology',
            labelText: `${ls('KQI_CALCULATOR_LAST_MILE_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПМ')}:`,
            labelWidth: '32%',
            inputWidth: '66%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="last-mile-technology"
                    options={Calculator.mapObjectToOptions(LAST_MILE_TECHNOLOGIES)}
                    onChange={value => this.setConfigProperty('last_mile_technology', value)}
                />
            ),
        }, {
            id: 'last-mile-technology-grouping',
            labelText: `${ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}:`,
            labelWidth: '32%',
            inputWidth: '68%',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Select
                    id="last-mile-technology-grouping"
                    options={Calculator.mapObjectToOptions(LOCATION_GROUPING)}
                    onChange={value => this.setConfigProperty('last_mile_technology_grouping', value)}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_TITLE', 'Тип технологии ПД'),
        horizontal: true,
        fields: [{
            id: 'last-inch-technology',
            labelText: `${ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПД')}:`,
            labelWidth: '32%',
            inputWidth: '66%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="last-inch-technology"
                    options={Calculator.mapObjectToOptions(LAST_INCH_TECHNOLOGIES)}
                    onChange={value => this.setConfigProperty('last_inch_technology', value)}
                />
            ),
        }, {
            id: 'last-inch-technology-grouping',
            labelText: ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_GROUPING_FIELD_LABEL', 'С группировкой по используемой технологии'),
            labelWidth: '90%',
            inputWidth: '6%',
            labelAlign: 'right',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Checkbox
                    id="last-inch-technology-grouping"
                    checked={_.get(this.state.config, 'last_inch_technology_grouping', false)}
                    onChange={value => this.setConfigProperty('last_inch_technology_grouping', value)}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_MANUFACTURE_TITLE', 'Производитель'),
        horizontal: true,
        fields: [{
            id: 'manufacture',
            labelText: `${ls('KQI_CALCULATOR_MANUFACTURE_FIELD_LABEL', 'Производитель')}:`,
            labelWidth: '32%',
            inputWidth: '66%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="manufacture"
                    options={Calculator.mapListToOptions(this.props, 'manufactureList')}
                    onChange={value => this.setConfigProperty('manufacture', value)}
                />
            ),
        }, {
            id: 'manufacture-grouping',
            labelText: ls('KQI_CALCULATOR_MANUFACTURE_GROUPING_FIELD_LABEL', 'С группировкой по производителю оборудования'),
            labelWidth: '90%',
            inputWidth: '6%',
            labelAlign: 'right',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Checkbox
                    id="manufacture-grouping"
                    checked={_.get(this.state.config, 'manufacture_grouping', false)}
                    onChange={value => this.setConfigProperty('manufacture_grouping', value)}
                />
            ),
        }]
    }];

    render() {
        const panels = this.getPanelsConfig();

        return (
            <Modal
                isOpen={this.props.active}
                className={styles.kqiCalculator}
            >
                <ModalHeader
                    toggle={this.onClose}>{ls('KQI_CALCULATOR_TITLE', 'Вычисление KQI')}</ModalHeader>
                <ModalBody>
                    <div className={styles.kqiCalculatorContent}>
                        {panels.map((panel, index) => {
                            const { fields, ...panelProps } = panel;
                            return (
                                <Panel
                                    key={`kqi-calculator-panel-${index}`}
                                    {...panelProps}
                                >
                                    {fields.map(fieldProps => (
                                        <Field key={fieldProps.id} {...fieldProps} />
                                    ))}
                                </Panel>
                            )
                        })}
                        <div className={styles.panelsGroup}>
                            <Panel
                                title={ls('KQI_CALCULATOR_EQUIPMENT_TITLE', 'Оборудование')}
                            >
                                <Field
                                    id="equipment-type"
                                    labelText={`${ls('KQI_CONFIGURATOR_EQUIPMENT_TYPE_FIELD_LABEL', 'Тип оборудования')}:`}
                                    labelWidth="32%"
                                    inputWidth="68%"
                                >
                                    <Select
                                        id="equipment-type"
                                        options={Calculator.mapListToOptions(this.props, 'equipmentsList')}
                                        onChange={value => this.setConfigProperty('equipment_type', value)}
                                    />
                                </Field>
                                <Field
                                    id="equipment-type-grouping"
                                    labelText={ls('KQI_CONFIGURATOR_EQUIPMENT_TYPE_GROUPING_FIELD_LABEL', 'С группировкой по типу оборудования')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="equipment-type-grouping"
                                        checked={_.get(this.state.config, 'equipment_grouping', []).includes(EQUIPMENT_TYPE_GROUPING.SELF)}
                                        onChange={value => this.setGroupingProperty('equipment_grouping', EQUIPMENT_TYPE_GROUPING.SELF, value)}
                                    />
                                </Field>
                                <Field
                                    id="hw-version-grouping"
                                    labelText={ls('KQI_CONFIGURATOR_HW_VERSION_GROUPING_FIELD_LABEL', 'С группировкой по hw версии')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="hw-version-grouping"
                                        checked={_.get(this.state.config, 'equipment_grouping', []).includes(EQUIPMENT_TYPE_GROUPING.HW)}
                                        onChange={value => this.setGroupingProperty('equipment_grouping', EQUIPMENT_TYPE_GROUPING.HW, value)}
                                    />
                                </Field>
                                <Field
                                    id="sw-version-grouping"
                                    labelText={ls('KQI_CONFIGURATOR_SW_VERSION_GROUPING_FIELD_LABEL', 'С группировкой по sw версии')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="sw-version-grouping"
                                        checked={_.get(this.state.config, 'equipment_grouping', []).includes(EQUIPMENT_TYPE_GROUPING.SW)}
                                        onChange={value => this.setGroupingProperty('equipment_grouping', EQUIPMENT_TYPE_GROUPING.SW, value)}
                                    />
                                </Field>
                            </Panel>
                            <Panel
                                title={ls('KQI_CALCULATOR_ABONENT_TITLE', '')}
                            >
                                <Field
                                    id="abonent-group"
                                    labelText={`${ls('KQI_CONFIGURATOR_ABONENT_GROUP_FIELD_LABEL', 'Группа абонентов')}:`}
                                    labelWidth="32%"
                                    inputWidth="68%"
                                >
                                    <Select
                                        id="abonent-group"
                                        options={Calculator.mapListToOptions(this.props, 'usergroupsList')}
                                        onChange={value => this.setConfigProperty('abonent_group', value)}
                                    />
                                </Field>
                                <Field
                                    id="abonent-grouping"
                                    labelText={ls('KQI_CONFIGURATOR_ABONENT_GROUPING_FIELD_LABEL', 'С группировкой по группам абонентов')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="abonent-grouping"
                                        checked={_.get(this.state.config, 'abonent_grouping', []).includes(ABONENT_GROUP_GROUPING.SELF)}
                                        onChange={value => this.setGroupingProperty('abonent_grouping', ABONENT_GROUP_GROUPING.SELF, value)}
                                    />
                                </Field>
                                <Field
                                    id="abonent-list-grouping"
                                    labelText={ls('KQI_CONFIGURATOR_ABONENT_LIST_FIELD_LABEL', 'Формировать список абонентов')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="abonent-list-grouping"
                                        checked={_.get(this.state.config, 'abonent_grouping', []).includes(ABONENT_GROUP_GROUPING.ABONENT)}
                                        onChange={value => this.setGroupingProperty('abonent_grouping', ABONENT_GROUP_GROUPING.ABONENT, value)}
                                    />
                                </Field>
                            </Panel>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="action" onClick={this.onClose}>
                        {ls('CANCEL', 'Отмена')}
                    </Button>
                    <Button color="action" onClick={this.onSubmit}>
                        {ls('OK', 'OK')}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Calculator;
