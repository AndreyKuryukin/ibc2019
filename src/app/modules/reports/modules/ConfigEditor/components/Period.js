import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import moment from 'moment';
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
        onIntervalChange: PropTypes.func,
        onAutoCheck: PropTypes.func,
    };

    static defaultProps = {
        onIntervalChange: () => null,
        onAutoCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            start: null,
            end: null,
            interval: INTERVALS.OTHER,
            isAutoChecked: false,
        };
    }

    onStartChange = (start) => {
        this.setState({
            start,
            interval: INTERVALS.OTHER,
        });

        this.props.onIntervalChange(start, this.state.end);
    };

    onEndChange = (end) => {
        this.setState({
            end,
            interval: INTERVALS.OTHER,
        });

        this.props.onIntervalChange(this.state.start, end);
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
                this.props.onIntervalChange(interval, this.state.start, this.state.end);
            });
        }
    };

    onAutoCheck = (value) => {
        this.setState({ isAutoChecked: value });
        this.props.onAutoCheck(value);
    };

    render() {
        return (
            <Panel
                title={ls('REPORTS_CONFIG_EDITOR_PERIOD_TITLE', 'Временной период отчёта')}
            >
                <div className={styles.intervalsGroup}>
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
                        }}
                    >
                        <Radio
                            id="other-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.OTHER}
                            onChange={v => this.onIntervalChange(INTERVALS.OTHER, v)}
                        />
                    </Field>
                </div>
                <Field
                    id="start-date"
                    labelText={`${ls('REPORTS_CONFIG_EDITOR_START_DATE_FIELD', 'Начало')}:`}
                    labelWidth="35%"
                    inputWidth="65%"
                    style={{
                        marginTop: 5,
                    }}
                >
                    <DateTimePicker
                        value={this.state.start}
                        max={this.state.end}
                        onChange={this.onStartChange}
                        inputWidth={114}
                        format={'DD.MM.YYYY HH:mm'}
                        time
                    />
                </Field>
                <Field
                    id="end-date"
                    labelText={`${ls('REPORTS_CONFIG_EDITOR_START_DATE_FIELD', 'Окончание')}:`}
                    labelWidth="35%"
                    inputWidth="65%"
                >
                    <DateTimePicker
                        value={this.state.end}
                        min={this.state.start}
                        onChange={this.onEndChange}
                        inputWidth={114}
                        format={'DD.MM.YYYY HH:mm'}
                        time
                    />
                </Field>
                <Field
                    id="auto-checkbox"
                    labelText={ls('REPORTS_CONFIG_EDITOR_AUTO_FIELD', 'Автогенерация')}
                    labelWidth="90%"
                    inputWidth="10%"
                    labelAlign="right"
                >
                    <Checkbox
                        id="auto-checkbox"
                        checked={this.state.isAutoChecked}
                        onChange={this.onAutoCheck}
                        disabled={this.state.interval === INTERVALS.OTHER}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Period;
