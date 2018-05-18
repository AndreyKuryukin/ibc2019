import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import { EQUIPMENT_TYPE_GROUPING } from '../constants';
import _ from "lodash";

class Equipment extends React.PureComponent {
    static propTypes = {
        equipmentsList: PropTypes.array,
        onEquipmentTypeChange: PropTypes.func,
        onGroupingChange: PropTypes.func,
        disabled: PropTypes.bool,
        value: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
        groupingValue: PropTypes.string
    };

    static defaultProps = {
        equipmentsList: [],
        onEquipmentTypeChange: () => null,
        onGroupingChange: () => null,
        disabled: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            grouping: null,
        };
    }

    onGroupingChange = (value) => {
        this.setState({ grouping: value });
        this.props.onGroupingChange(value);
    };

    getGropingOptions = () => ([
            {
                title: ls('KQI_CONFIGURATOR_HW_VERSION_GROUPING_FIELD_LABEL', 'С группировкой по hw версии'),
                value: EQUIPMENT_TYPE_GROUPING.HW
            },
            {
                title: ls('KQI_CONFIGURATOR_SW_VERSION_GROUPING_FIELD_LABEL', 'С группировкой по sw версии'),
                value: EQUIPMENT_TYPE_GROUPING.SW
            },
            {
                title: ls('KQI_CONFIGURATOR_EQUIPMENT_TYPE_GROUPING_FIELD_LABEL', 'С группировкой по типу оборудования'),
                value: EQUIPMENT_TYPE_GROUPING.SELF
            }
        ]
    );

    onEquipmentTypeChange = (value) => {
        if (value) {
            this.onGroupingChange(null);
        }
        this.props.onEquipmentTypeChange(value);
    };

    render() {
        const { value, disabled } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_EQUIPMENT_TITLE', 'Оборудование')}
            >
                <Field
                    id="equipment-type"
                    labelText={`${ls('KQI_CONFIGURATOR_EQUIPMENT_TYPE_FIELD_LABEL', 'Тип оборудования')}`}
                    labelWidth="32%"
                    inputWidth="68%"
                >
                    <Select
                        id="equipment-type"
                        options={this.props.equipmentsList}
                        onChange={this.onEquipmentTypeChange}
                        value={value}
                        disabled={disabled}
                    />
                </Field>
                <Field
                    id="self-equipment-type"
                    labelText={ls('KQI_CONFIGURATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}
                    labelWidth="32%"
                    inputWidth="68%"
                >
                    <Select
                        id="self-equipment-type"
                        options={this.getGropingOptions()}
                        value={_.get(this.props, 'groupingValue', this.state.grouping)}
                        placeholder={ls('KQI_CONFIGURATOR_GROUPING_FIELD_PLACEHOLDER', 'Выберите группировку')}
                        onChange={v => this.onGroupingChange(v)}
                        disabled={disabled || !!value}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Equipment;
