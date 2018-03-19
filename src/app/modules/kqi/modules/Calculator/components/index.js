import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from "i18n";

import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from "../../../../../components/Field";
import Checkbox from "../../../../../components/Checkbox";
import styles from './styles.scss';

class Calculator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
    };

    onClose = () => {
        this.context.history.push('/kqi');
    }

    onSubmit = () => {
        console.log('onSubmit');
    }

    getPanelsConfig = () => [{
        title: ls('KQI_CALCULATOR_BASIC_PARAMETERS_TITLE', 'Основные параметры'),
        fields: [{
            id: 'service',
            labelText: `${ls('KQI_CALCULATOR_SERVICE_FIELD_LABEL', 'Услуга')}:`,
            labelWidth: '20%',
            inputWidth: '80%',
            children: (
                <Select
                    id="service"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }, {
            id: 'kqi',
            labelText: `${ls('KQI_CALCULATOR_KQI_FIELD_LABEL', 'KQI')}:`,
            labelWidth: '20%',
            inputWidth: '80%',
            children: (
                <Select
                    id="kqi"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_SETTINGS_TITLE', 'Настройки'),
        horizontal: true,
        fields: [{
            id: 'time-interval',
            labelText: `${ls('KQI_CALCULATOR_TIME_INTERVAL_FIELD_LABEL', 'Временной интервал')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Input
                    id="time-interval"
                    value={''}
                    onChange={() => {}}
                />
            ),
        }, {
            id: 'time-interval-grouping',
            labelText: `${ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Select
                    id="time-interval-grouping"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_LOCATION_TITLE', 'Расположение'),
        horizontal: true,
        fields: [{
            id: 'location',
            labelText: `${ls('KQI_CALCULATOR_LOCATION_FIELD_LABEL', 'Местоположение')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="location"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }, {
            id: 'location-grouping',
            labelText: `${ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Select
                    id="location-grouping"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_PM_TECHNOLOGY_TITLE', 'Тип технологии ПМ'),
        horizontal: true,
        fields: [{
            id: 'pm-technology',
            labelText: `${ls('KQI_CALCULATOR_PM_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПМ')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="pm-technology"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }, {
            id: 'pm-technology-grouping',
            labelText: `${ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Select
                    id="pm-technology-grouping"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_PD_TECHNOLOGY_TITLE', 'Тип технологии ПД'),
        horizontal: true,
        fields: [{
            id: 'pd-technology',
            labelText: `${ls('KQI_CALCULATOR_PD_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПД')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="pd-technology"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }, {
            id: 'pd-technology-grouping',
            labelText: ls('KQI_CALCULATOR_PD_TECHNOLOGY_GROUPING_FIELD_LABEL', 'С группировкой по используемой технологии'),
            labelWidth: '90%',
            inputWidth: '5%',
            labelAlign: 'right',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Checkbox
                    id="pd-technology-grouping"
                    checked={false}
                    onChange={() => null}
                    disabled
                />
            ),
        }]
    }, {
        title: ls('KQI_CALCULATOR_PRODUCER_TITLE', 'Производитель'),
        horizontal: true,
        fields: [{
            id: 'producer',
            labelText: `${ls('KQI_CALCULATOR_PRODUCER_FIELD_LABEL', 'Производитель')}:`,
            labelWidth: '40%',
            inputWidth: '60%',
            style: {
                flex: '1 1 0',
            },
            children: (
                <Select
                    id="producer"
                    options={[]}
                    onChange={() => {}}
                />
            ),
        }, {
            id: 'producer-grouping',
            labelText: ls('KQI_CALCULATOR_PRODUCER_GROUPING_FIELD_LABEL', 'С группировкой по производителю оборудования'),
            labelWidth: '90%',
            inputWidth: '5%',
            labelAlign: 'right',
            style: {
                flex: '1 1 0',
                marginTop: 0,
            },
            children: (
                <Checkbox
                    id="producer-grouping"
                    checked={false}
                    onChange={() => null}
                    disabled
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
                                    labelWidth="35%"
                                    inputWidth="65%"
                                >
                                    <Select
                                        id="equipment-type"
                                        options={[]}
                                        onChange={() => {}}
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
                                        checked={false}
                                        onChange={() => null}
                                        disabled
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
                                        checked={false}
                                        onChange={() => null}
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
                                        checked={false}
                                        onChange={() => null}
                                    />
                                </Field>
                            </Panel>
                            <Panel
                                title={ls('KQI_CALCULATOR_SUBSCRIBERS_TITLE', '')}
                            >
                                <Field
                                    id="subscribers-group"
                                    labelText={`${ls('KQI_CONFIGURATOR_SUBSCRIBERS_GROUP_FIELD_LABEL', 'Группа абонентов')}:`}
                                    labelWidth="35%"
                                    inputWidth="65%"
                                >
                                    <Select
                                        id="subscribers-group"
                                        options={[]}
                                        onChange={() => {}}
                                    />
                                </Field>
                                <Field
                                    id="subscribers-grouping"
                                    labelText={ls('KQI_CONFIGURATOR_SUBSCRIBERS_GROUPING_FIELD_LABEL', 'С группировкой по группам абонентов')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="subscribers-grouping"
                                        checked={false}
                                        onChange={() => null}
                                        disabled
                                    />
                                </Field>
                                <Field
                                    id="subscribers-list"
                                    labelText={ls('KQI_CONFIGURATOR_SUBSCRIBERS_LIST_FIELD_LABEL', 'Формировать список абонентов')}
                                    labelWidth="67%"
                                    inputWidth="5%"
                                    labelAlign="right"
                                >
                                    <Checkbox
                                        id="subscribers-list"
                                        checked={false}
                                        onChange={() => null}
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
