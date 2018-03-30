import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Radio from '../../../../../components/Radio';
import { EQUIPMENT_TYPE_GROUPING } from '../constants';

class Equipment extends React.PureComponent {
    static propTypes = {
        equipmentsList: PropTypes.array,
        onEquipmentTypeChange: PropTypes.func,
        onGroupingChange: PropTypes.func,
    };

    static defaultProps = {
        equipmentsList: [],
        onEquipmentTypeChange: () => null,
        onGroupingChange: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            grouping: null,
        };
    }

    onGroupingChange = (grouping, value) => {
        if (value) {
            this.setState({ grouping });

            this.props.onGroupingChange(grouping);
        }
    };

    render() {
        return (
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
                        options={this.props.equipmentsList}
                        onChange={this.props.onEquipmentTypeChange}
                    />
                </Field>
                <Field
                    id="self-equipment-type"
                    labelText={ls('KQI_CONFIGURATOR_EQUIPMENT_TYPE_GROUPING_FIELD_LABEL', 'С группировкой по типу оборудования')}
                    labelWidth="67%"
                    inputWidth="5%"
                    labelAlign="right"
                >
                    <Radio
                        id="self-equipment-type"
                        name="equipment-type-grouping"
                        checked={this.state.grouping === EQUIPMENT_TYPE_GROUPING.SELF}
                        onChange={v => this.onGroupingChange(EQUIPMENT_TYPE_GROUPING.SELF, v)}
                    />
                </Field>
                <Field
                    id="hw-equipment-type"
                    labelText={ls('KQI_CONFIGURATOR_HW_VERSION_GROUPING_FIELD_LABEL', 'С группировкой по hw версии')}
                    labelWidth="67%"
                    inputWidth="5%"
                    labelAlign="right"
                >
                    <Radio
                        id="hw-equipment-type"
                        name="equipment-type-grouping"
                        checked={this.state.grouping === EQUIPMENT_TYPE_GROUPING.HW}
                        onChange={v => this.onGroupingChange(EQUIPMENT_TYPE_GROUPING.HW, v)}
                    />
                </Field>
                <Field
                    id="sw-equipment-type"
                    labelText={ls('KQI_CONFIGURATOR_SW_VERSION_GROUPING_FIELD_LABEL', 'С группировкой по sw версии')}
                    labelWidth="67%"
                    inputWidth="5%"
                    labelAlign="right"
                >
                    <Radio
                        id="sw-equipment-type"
                        name="equipment-type-grouping"
                        checked={this.state.grouping === EQUIPMENT_TYPE_GROUPING.SW}
                        onChange={v => this.onGroupingChange(EQUIPMENT_TYPE_GROUPING.SW, v)}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Equipment;
