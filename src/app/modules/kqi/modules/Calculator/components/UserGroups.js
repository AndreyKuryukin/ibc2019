import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Radio from '../../../../../components/Radio';
import { ABONENT_GROUP_GROUPING } from '../constants';

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

    onGroupingChange = (grouping, value) => {
        if (value) {
            this.setState({ grouping });

            this.props.onGroupingChange(grouping);
        }
    };

    render() {
        const { value, groupingValue, disabled } = this.props;

        return (
            <Panel
                title={ls('KQI_CALCULATOR_ABONENT_TITLE', 'Абоненты')}
            >
                <Field
                    id="abonent-group"
                    labelText={`${ls('KQI_CONFIGURATOR_ABONENT_GROUP_FIELD_LABEL', 'Группа абонентов')}:`}
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
                    id="self-type-abonent-grouping"
                    labelText={ls('KQI_CONFIGURATOR_ABONENT_GROUPING_FIELD_LABEL', 'С группировкой по группам абонентов')}
                    labelWidth="67%"
                    inputWidth="5%"
                    labelAlign="right"
                >
                    <Radio
                        id="self-type-abonent-grouping"
                        name="abonent-grouping"
                        checked={this.state.grouping === ABONENT_GROUP_GROUPING.SELF || groupingValue === ABONENT_GROUP_GROUPING.SELF}
                        onChange={v => this.onGroupingChange(ABONENT_GROUP_GROUPING.SELF, v)}
                        disabled={disabled}
                    />
                </Field>
                <Field
                    id="abonent-type-abonent-grouping"
                    labelText={ls('KQI_CONFIGURATOR_ABONENT_LIST_FIELD_LABEL', 'Формировать список абонентов')}
                    labelWidth="67%"
                    inputWidth="5%"
                    labelAlign="right"
                >
                    <Radio
                        id="abonent-type-abonent-grouping"
                        name="abonent-grouping"
                        checked={this.state.grouping === ABONENT_GROUP_GROUPING.ABONENT || groupingValue === ABONENT_GROUP_GROUPING.ABONENT}
                        onChange={v => this.onGroupingChange(ABONENT_GROUP_GROUPING.ABONENT, v)}
                        disabled={disabled}
                    />
                </Field>
            </Panel>
        );
    }
}

export default UserGroups;
