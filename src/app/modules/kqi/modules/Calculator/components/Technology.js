import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Checkbox from '../../../../../components/Checkbox';
import * as _ from "lodash";

class Technology extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string,
        label: PropTypes.string,
        technologies: PropTypes.array,
        onTechnologyChange: PropTypes.func,
        onGroupingChange: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        label: '',
        technologies: [],
        onTechnologyChange: () => null,
        onGroupingChange: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isGroupingChecked: false,
        };
    }

    onGroupingCheck = (value) => {
        this.setState({ isGroupingChecked: value });
        this.props.onGroupingChange(value);
    };

    render() {
        const { value, disabled } = this.props;
        return (
            <Panel
                title={this.props.title}
                horizontal
            >
                <Field
                    id={this.props.id}
                    labelText={this.props.label}
                    labelWidth="32%"
                    inputWidth="66%"
                    style={{
                        flex: '1 1 0',
                    }}
                >
                    <Select
                        id={this.props.id}
                        placeholder={ls('KQI_CALCULATOR_TECHNOLOGY_PLACEHOLDER', 'Выберите технологию')}
                        options={this.props.technologies}
                        onChange={this.props.onTechnologyChange}
                        value={value}
                        disabled={disabled}
                    />
                </Field>
                <Field
                    id={`${this.props.id}-grouping`}
                    labelText={ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_GROUPING_FIELD_LABEL', 'С группировкой по используемой технологии')}
                    labelWidth="90%"
                    inputWidth="6%"
                    labelAlign="right"
                    style={{
                        flex: '1 1 0',
                    }}
                >
                    <Checkbox
                        id={`${this.props.id}-grouping`}
                        checked={_.get(this.props, 'groupingValue', this.state.isGroupingChecked)}
                        onChange={this.onGroupingCheck}
                        disabled={disabled || value}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Technology;