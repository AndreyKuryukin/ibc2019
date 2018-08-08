import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Checkbox from '../../../../../components/Checkbox';
import * as _ from "lodash";
import styles from './styles.scss';

const fieldStyle = { flex: '1 1 0' };

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
                    style={fieldStyle}
                >
                    <Select
                        itemId="kqi_projections_technology_field"
                        id={this.props.id}
                        placeholder={ls('KQI_CALCULATOR_TECHNOLOGY_PLACEHOLDER', 'Выберите технологию')}
                        options={this.props.technologies}
                        onChange={this.props.onTechnologyChange}
                        value={value}
                        disabled={disabled}
                    />
                </Field>
                <div className={styles.groupingBlock}>
                    <Field
                        id={`${this.props.id}-grouping`}
                        labelText={ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_GROUPING_FIELD_LABEL', 'С группировкой по используемой технологии')}

                        inputWidth={25}
                        labelWidth={405}
                        labelAlign="right"
                        splitter=""
                        style={fieldStyle}
                    >
                    <Checkbox
                        itemId="kqi_projections_technology_grouping_check"
                        id={`${this.props.id}-grouping`}
                        checked={_.get(this.props, 'groupingValue', this.state.isGroupingChecked)}
                        onChange={this.onGroupingCheck}
                        disabled={disabled || value}
                    />
                </Field></div>
            </Panel>
        );
    }
}

export default Technology;
