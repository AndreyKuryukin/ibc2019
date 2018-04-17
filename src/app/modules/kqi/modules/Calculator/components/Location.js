import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import { createSelector } from 'reselect';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Checkbox from '../../../../../components/Checkbox';
import styles from './styles.scss';
import _ from "lodash";

class Location extends React.PureComponent {
    static propTypes = {
        locationOptions: PropTypes.array,
        groupingOptions: PropTypes.array,
        onLocationChange: PropTypes.func,
        onGroupingTypeChange: PropTypes.func,
    };

    static defaultProps = {
        locationOptions: [],
        groupingOptions: [],
        onLocationChange: () => null,
        onGroupingTypeChange: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isGroupingChecked: false,
            groupingType: props.groupingOptions[0] ? props.groupingOptions[0].value : null,
        };
    }

    onGroupingCheck = (value) => {
        if (value) {
            this.props.onGroupingTypeChange(this.state.groupingType);
        } else {
            this.props.onGroupingTypeChange(null);
        }

        this.setState({ isGroupingChecked: value });
    };

    onGroupingTypeChange = (value) => {
        //todo Запилить логику на выбор способа группировки исходя из выбранного местоположения
        if (this.state.isGroupingChecked) {
            this.setState({ groupingType: value });
            this.props.onGroupingTypeChange(value);
        }
    };

    render() {
        const { config, disabled } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_LOCATION_TITLE', 'Расположение')}
                horizontal
            >
                <Field
                    id="location"
                    labelText={`${ls('KQI_CALCULATOR_LOCATION_FIELD_LABEL', 'МРФ')}:`}
                    labelWidth="32%"
                    inputWidth="66%"
                    style={{
                        flex: '1 1 0',
                    }}
                >
                    <Select
                        id="location"
                        options={this.props.locationOptions}
                        onChange={this.props.onLocationChange}
                        value={_.get(config, 'location')}
                        placeholder={ls('KQI_CALCULATOR_LOCATION_FIELD_PLACEHOLDER', 'Выберите МРФ')}
                        disabled={disabled}
                    />
                </Field>
                <div className={styles.groupingBlock}>
                    <Checkbox
                        id="location-grouping-check"
                        checked={this.state.isGroupingChecked || _.get(config, 'location_grouping')}
                        onChange={this.onGroupingCheck}
                        style={{ marginLeft: 18 }}
                        disabled={disabled}
                    />
                    <Field
                        id="location-grouping"
                        labelText={ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}
                        labelWidth="30%"
                        inputWidth="70%"
                        style={{
                            flexGrow: 1,
                        }}
                    >
                        <Select
                            id="location-grouping"
                            disabled={!this.state.isGroupingChecked || disabled}
                            options={this.props.groupingOptions}
                            value={_.get(config, 'location_grouping')}
                            onChange={this.onGroupingTypeChange}
                            noEmptyOption
                        />
                    </Field>
                </div>
            </Panel>
        );
    }
}

export default Location;
