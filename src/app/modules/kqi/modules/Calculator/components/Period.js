import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import moment from 'moment';
import _ from 'lodash';
import Panel from '../../../../../components/Panel';
import Radio from '../../../../../components/Radio';
import Checkbox from '../../../../../components/Checkbox';
import Field from '../../../../../components/Field';
import DateTimePicker from '../../../../../components/DateTimePicker';
import Select from '../../../../../components/Select';
import styles from './styles.scss';

const INTERVALS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    OTHER: 'other',
};

class Period extends React.PureComponent {
    static propTypes = {
        groupingOptions: PropTypes.array,
        onIntervalChange: PropTypes.func,
        onGroupingTypeChange: PropTypes.func,
        onAutoGenChange: PropTypes.func,
        errors: PropTypes.object,
        isAutoGen: PropTypes.bool,
    };

    static defaultProps = {
        groupingOptions: [],
        onIntervalChange: () => null,
        onGroupingTypeChange: () => null,
        onAutoGenChange: () => null,
        errors: null,
        isAutoGen: false,
    };

    static mapObjectToOptions(object) {
        return _.map(object, (title, value) => ({ value, title }));
    }

    constructor(props) {
        super(props);

        this.state = {
            start: null,
            end: null,
            interval: INTERVALS.OTHER,
            isGroupingChecked: false,
            groupingType: props.groupingOptions[0] ? props.groupingOptions[0].value : null,
        };
    }

    onStartChange = (start) => {
        this.setState({
            start,
            interval: INTERVALS.OTHER,
        });

        this.props.onIntervalChange(start, this.state.end, INTERVALS.OTHER.toUpperCase());
    };

    onEndChange = (end) => {
        this.setState({
            end,
            interval: INTERVALS.OTHER,
        });

        this.props.onIntervalChange(this.state.start, end, INTERVALS.OTHER.toUpperCase());
    };

    onGroupingCheck = (value) => {
        if (value) {
            this.props.onGroupingTypeChange(this.state.groupingType);
        } else {
            this.props.onGroupingTypeChange(null);
        }

        this.setState({ isGroupingChecked: value });
    };

    onGroupingTypeChange = (value) => {
        //todo Запилить логику на выбор способа группировки исходя из выбранного интервала
        if (this.state.isGroupingChecked) {
            this.setState({ groupingType: value });
            this.props.onGroupingTypeChange(value);
        }
    };

    onIntervalChange = (interval, value) => {
        if (value) {
            const start = moment().subtract(1, interval).startOf(interval);
            const end = moment(start).endOf(interval);

            this.setState({
                interval,
                start: interval !== INTERVALS.OTHER ? start.toDate() : this.state.start,
                end: interval !== INTERVALS.OTHER ? end.toDate() : this.state.end,
            }, () => {
                this.props.onIntervalChange(this.state.start, this.state.end, interval.toUpperCase());
            });
        }
    };

    render() {
        const { errors } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_PERIOD_TITLE', 'Период')}
            >
                <div className={styles.kqiPeriod}>
                    <Field
                        id="day-interval"
                        labelText={ls('TIME_INTERVAL_DAY', 'День')}
                        inputWidth={15}
                        labelAlign="right"
                    >
                        <Radio
                            id="day-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.DAY}
                            onChange={v => this.onIntervalChange(INTERVALS.DAY, v)}
                        />
                    </Field>
                    <Field
                        id="week-interval"
                        labelText={ls('TIME_INTERVAL_WEEK', 'Неделя')}
                        inputWidth={15}
                        labelAlign="right"
                        style={{
                            marginTop: 0,
                            marginLeft: 10,
                        }}
                    >
                        <Radio
                            id="week-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.WEEK}
                            onChange={v => this.onIntervalChange(INTERVALS.WEEK, v)}
                        />
                    </Field>
                    <Field
                        id="month-interval"
                        labelText={ls('TIME_INTERVAL_MONTH', 'Месяц')}
                        inputWidth={15}
                        labelAlign="right"
                        style={{
                            marginTop: 0,
                            marginLeft: 10,
                        }}
                    >
                        <Radio
                            id="month-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.MONTH}
                            onChange={v => this.onIntervalChange(INTERVALS.MONTH, v)}
                        />
                    </Field>
                    <Field
                        id="other-interval"
                        labelText={`${ls('TIME_INTERVAL_OTHER', 'Другое')}:`}
                        inputWidth={15}
                        labelAlign="right"
                        style={{
                            marginTop: 0,
                            marginLeft: 10,
                        }}
                    >
                        <Radio
                            id="other-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.OTHER}
                            onChange={v => this.onIntervalChange(INTERVALS.OTHER, v)}
                        />
                    </Field>
                    <DateTimePicker
                        value={this.state.start}
                        max={this.state.end}
                        onChange={this.onStartChange}
                        inputWidth={90}
                        format={'DD.MM.YYYY HH:mm'}
                        time
                        valid={errors && _.isEmpty(errors.start_date_time)}
                    />
                    <DateTimePicker
                        value={this.state.end}
                        min={this.state.start}
                        onChange={this.onEndChange}
                        inputWidth={90}
                        format={'DD.MM.YYYY HH:mm'}
                        style={{ marginLeft: 15 }}
                        time
                        valid={errors && _.isEmpty(errors.end_date_time)}
                    />
                    <div className={styles.groupingBlock}>
                        <Checkbox
                            id="date-time-grouping-check"
                            checked={this.state.isGroupingChecked}
                            onChange={this.onGroupingCheck}
                            style={{ marginLeft: 30 }}
                        />
                        <Field
                            id="date-time-grouping"
                            labelText={ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}
                            labelWidth="38%"
                            inputWidth="62%"
                            style={{
                                flexGrow: 1,
                            }}
                        >
                            <Select
                                id="date-time-grouping"
                                value={this.state.groupingType}
                                options={this.props.groupingOptions}
                                onChange={this.onGroupingTypeChange}
                                disabled={!this.state.isGroupingChecked}
                                noEmptyOption
                            />
                        </Field>
                    </div>
                </div>
                <Field
                    id="auto-checkbox"
                    labelText={ls('KQI_CALCULATOR_AUTOGEN_FIELD_LABEL', 'Автогенерация')}
                    labelWidth="98%"
                    inputWidth="2%"
                    labelAlign="right"
                >
                    <Checkbox
                        id="auto-checkbox"
                        checked={this.props.isAutoGen}
                        onChange={this.props.onAutoGenChange}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Period;
