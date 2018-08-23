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

const fieldStyle = { flex: '1 1 0' };
const selectStyle = { width: 290 };

class Location extends React.PureComponent {
    static propTypes = {
        locationOptions: PropTypes.array,
        groupingOptions: PropTypes.array,
        onLocationChange: PropTypes.func,
        onGroupingTypeChange: PropTypes.func,
        isKgs: PropTypes.bool,
    };

    static defaultProps = {
        isKgs: false,
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

    componentWillReceiveProps(nextProps) {
        const config = _.get(nextProps, 'config', this.props.config);
        const groupingType = _.get(config, 'location_grouping');
        if (groupingType !== this.state.groupingType) {
            this.setState({ groupingType });
        }
    }

    onGroupingCheck = (value) => {
        if (value) {
            this.props.onGroupingTypeChange('RF');
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
        const { config, disabled, isKgs } = this.props;
        const locationGrouping= _.get(config, 'location_grouping');
        return (
            <Panel
                title={ls('KQI_CALCULATOR_LOCATION_TITLE', 'Расположение')}
                horizontal
            >
                {!isKgs && <Field
                    id="location"
                    labelText={ls('KQI_CALCULATOR_LOCATION_FIELD_LABEL', 'МРФ')}
                    labelWidth="32%"
                    inputWidth="66%"
                    style={fieldStyle}
                >
                    <Select
                        itemId="kqi_projections_location_field"
                        id="location"
                        options={this.props.locationOptions}
                        onChange={this.props.onLocationChange}
                        value={_.get(config, 'location') || ''}
                        placeholder={ls('KQI_CALCULATOR_LOCATION_FIELD_PLACEHOLDER', 'Выберите МРФ')}
                        disabled={disabled}
                    />
                </Field>}
                <div className={styles.groupingBlock}>
                    <Field
                        id="location-grouping-check"
                        labelText={ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}
                        inputWidth={25}
                        labelWidth={115}
                        labelAlign="right"
                    >
                        <Checkbox
                            itemId="kqi_projections_location_grouping_check"
                            id="location-grouping-check"
                            checked={this.state.isGroupingChecked || locationGrouping && locationGrouping !== 'NONE'}
                            onChange={this.onGroupingCheck}
                            disabled={disabled}
                        />
                    </Field>
                    <Select
                        itemId="kqi_projections_location_grouping_field"
                        id="location-grouping"
                        disabled={!this.state.isGroupingChecked || disabled}
                        options={_.get(config, 'location') ? [this.props.groupingOptions[0]] : this.props.groupingOptions}
                        value={_.get(config, 'location_grouping')}
                        onChange={this.onGroupingTypeChange}
                        style={selectStyle}
                        noEmptyOption
                    />
                </div>
            </Panel>
        );
    }
}

export default Location;
