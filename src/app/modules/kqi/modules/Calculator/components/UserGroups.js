import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import { ABONENT_GROUP_GROUPING } from '../constants';
import _ from "lodash";

class UserGroups extends React.PureComponent {
    static propTypes = {
        usergroupsList: PropTypes.array,
        onUsergroupChange: PropTypes.func,
        onGroupingChange: PropTypes.func,
    };

    static defaultProps = {
        usergroupsList: [],
        onUsergroupChange: () => null,
        onGroupingChange: () => null,
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
                title: ls('KQI_CONFIGURATOR_ABONENT_GROUPING_FIELD_LABEL', 'С группировкой по группам абонентов'),
                value: ABONENT_GROUP_GROUPING.SELF
            },
            {
                title: ls('KQI_CONFIGURATOR_ABONENT_LIST_FIELD_LABEL', 'Формировать список абонентов'),
                value: ABONENT_GROUP_GROUPING.ABONENT
            }
        ]
    );

    render() {
        const { value, groupingValue, disabled } = this.props;

        return (
            <Panel
                title={ls('KQI_CALCULATOR_ABONENT_TITLE', 'Абоненты')}
            >
                <Field
                    id="abonent-group"
                    labelText={`${ls('KQI_CONFIGURATOR_ABONENT_GROUP_FIELD_LABEL', 'Группа абонентов')}`}
                    labelWidth="32%"
                    inputWidth="68%"
                >
                    <Select
                        id="abonent-group"
                        options={this.props.usergroupsList}
                        onChange={this.props.onUsergroupChange}
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

export default UserGroups;
