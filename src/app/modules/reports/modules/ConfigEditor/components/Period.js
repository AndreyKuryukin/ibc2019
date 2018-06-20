import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import moment from 'moment';
import _ from 'lodash';
import Panel from '../../../../../components/Panel';
import Radio from '../../../../../components/Radio';
import Checkbox from '../../../../../components/Checkbox';
import Field from '../../../../../components/Field';
import DateTimePicker from '../../../../../components/DateTimePicker';
import styles from './styles.scss';
import Icon from "../../../../../components/Icon/Icon";

const INTERVALS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    OTHER: 'other',
};

const panelStyle = {
    display: 'flex',
};

const intervalFieldStyle = {
    marginTop: 0,
    marginLeft: 10,
};

const startDateFieldStyle = {
    marginTop: 5,
};

class Period extends React.PureComponent {
    static contextTypes = {
        notifications: PropTypes.object.isRequired,
    };

    static propTypes = {
        onIntervalChange: PropTypes.func,
        onAutoCheck: PropTypes.func,
        templateId: PropTypes.string,
        errors: PropTypes.object,
    };

    static defaultProps = {
        onIntervalChange: () => null,
        onAutoCheck: () => null,
        templateId: '',
        errors: null
    };

    constructor(props) {
        super(props);

        this.state = {
            start: null,
            end: null,
            interval: INTERVALS.WEEK,
            isAutoChecked: true,
        };
    }

    componentDidMount() {
        this.onIntervalChange(this.state.interval, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.templateId === '9' && this.props.templateId !== nextProps.templateId) {
            this.onIntervalChange(INTERVALS.WEEK, true);
        }
    }

    onStartChange = (start) => {
        if (this.state.interval !== INTERVALS.OTHER) {
            this.context.notifications.notify({
                title: ls('WARNING', 'Предупреждение'),
                message: ls('TIME_INTERVAL_OTHER_TITLE', 'При выборе данного пункта невозможно задать расписание для формирования отчета'),
                type: 'WARNING',
            });
        }
        this.setState({
            start,
            interval: INTERVALS.OTHER,
            isAutoChecked: false,
        });

        this.props.onIntervalChange(INTERVALS.OTHER, start, this.state.end);
    };

    onEndChange = (end) => {
        if (this.state.interval !== INTERVALS.OTHER) {
            this.context.notifications.notify({
                title: ls('WARNING', 'Предупреждение'),
                message: ls('TIME_INTERVAL_OTHER_TITLE', 'При выборе данного пункта невозможно задать расписание для формирования отчета'),
                type: 'WARNING',
            });
        }

        this.setState({
            end,
            interval: INTERVALS.OTHER,
            isAutoChecked: false,
        });

        this.props.onIntervalChange(INTERVALS.OTHER, this.state.start, end);
    };

    onIntervalChange = (interval, value) => {
        if (value) {
            const start = moment().subtract(1, interval).startOf(interval);
            const end = moment(start).endOf(interval);

            this.setState({
                interval,
                start: interval !== INTERVALS.OTHER ? start.toDate() : this.state.start,
                end: interval !== INTERVALS.OTHER ? end.toDate() : this.state.end,
                isAutoChecked: interval !== INTERVALS.OTHER ? this.state.isAutoChecked : false,
            }, () => {
                if (interval === INTERVALS.OTHER) {
                    this.context.notifications.notify({
                        title: ls('WARNING', 'Предупреждение'),
                        message: ls('TIME_INTERVAL_OTHER_TITLE', 'При выборе данного пункта невозможно задать расписание для формирования отчета'),
                        type: 'WARNING',
                    });
                }
                this.props.onIntervalChange(interval, this.state.start, this.state.end, this.state.isAutoChecked);
            });
        }
    };

    onAutoCheck = (value) => {
        this.setState({ isAutoChecked: value });
        this.props.onAutoCheck(value);
    };

    render() {
        const { errors, templateId } = this.props;
        return (
            <Panel
                title={<div
                    style={panelStyle}>{ls('REPORTS_CONFIG_EDITOR_PERIOD_TITLE', 'Временной период отчёта')}
                    <Icon
                        icon={'help-icon'}
                        title={
                            ls('TIME_INTERVAL_DAY_COMMON_TITLE', 'День - предыдущие сутки с 00:00 до 24:00') + '\n'
                            + ls('TIME_INTERVAL_WEEK_COMMON_TITLE', 'Неделя - предыдущая неделя с 00:00 часов понедельника до 24:00 часов воскресения') + '\n'
                            + ls('TIME_INTERVAL_MONTH_COMMON_TITLE', 'Месяц - предыдущий месяц 00:00 часов 1-го числа до 24:00 часов последнего числа')}
                    />
                </div>}
            >
                <div className={styles.intervalsGroup}>
                    {templateId !== '9' && <Field
                        id="day-interval"
                        labelText={ls('TIME_INTERVAL_DAY', 'День')}
                        inputWidth={15}
                        labelAlign="right"
                        title={ls('TIME_INTERVAL_DAY_TITLE', 'Предыдущие сутки с 00:00 до 24:00')}
                        splitter=""
                    >
                        <Radio
                            id="day-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.DAY}
                            onChange={v => this.onIntervalChange(INTERVALS.DAY, v)}
                        />
                    </Field>}
                    <Field
                        id="week-interval"
                        labelText={ls('TIME_INTERVAL_WEEK', 'Неделя')}
                        inputWidth={15}
                        labelAlign="right"
                        style={intervalFieldStyle}
                        title={ls('TIME_INTERVAL_WEEK_TITLE', 'Предыдущая неделя с 00:00 часов понедельника до 24:00 часов воскресения')}
                        splitter=""
                    >
                        <Radio
                            id="week-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.WEEK}
                            onChange={v => this.onIntervalChange(INTERVALS.WEEK, v)}
                        />
                    </Field>
                    {templateId !== '9' && <Fragment>
                        <Field
                            id="month-interval"
                            labelText={ls('TIME_INTERVAL_MONTH', 'Месяц')}
                            inputWidth={15}
                            labelAlign="right"
                            style={intervalFieldStyle}
                            title={ls('TIME_INTERVAL_MONTH_TITLE', 'Предыдущий месяц 00:00 часов 1-го числа до 24:00 часов последнего числа')}
                            splitter=""
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
                            labelText={ls('TIME_INTERVAL_OTHER', 'Другое')}
                            inputWidth={15}
                            labelAlign="right"
                            style={intervalFieldStyle}
                            title={ls('TIME_INTERVAL_OTHER_TITLE', 'При выборе данного пункта невозможно задать расписание для формирования отчета')}
                            splitter=""
                        >
                            <Radio
                                id="other-interval"
                                name="time-interval"
                                checked={this.state.interval === INTERVALS.OTHER}
                                onChange={v => this.onIntervalChange(INTERVALS.OTHER, v)}
                            />
                        </Field>
                    </Fragment>}
                </div>
                <Field
                    id="start-date"
                    labelText={ls('REPORTS_CONFIG_EDITOR_START_DATE_FIELD', 'Начало')}
                    labelWidth="35%"
                    inputWidth="65%"
                    style={startDateFieldStyle}
                    required
                >
                    <DateTimePicker
                        value={this.state.start}
                        max={this.state.end}
                        onChange={this.onStartChange}
                        inputWidth={114}
                        format={'DD.MM.YYYY HH:mm'}
                        disabled={this.state.interval !== INTERVALS.OTHER}
                        time
                        valid={errors && _.isEmpty(errors.start_date)}
                    />
                </Field>
                <Field
                    id="end-date"
                    labelText={ls('REPORTS_CONFIG_EDITOR_START_DATE_FIELD', 'Окончание')}
                    labelWidth="35%"
                    inputWidth="65%"
                    required
                >
                    <DateTimePicker
                        value={this.state.end}
                        min={this.state.start}
                        onChange={this.onEndChange}
                        inputWidth={114}
                        format={'DD.MM.YYYY HH:mm'}
                        disabled={this.state.interval !== INTERVALS.OTHER}
                        time
                        valid={errors && _.isEmpty(errors.end_date)}
                    />
                </Field>
                <Field
                    id="auto-checkbox"
                    labelText={ls('REPORTS_CONFIG_EDITOR_AUTO_FIELD', 'Автогенерация')}
                    labelWidth="95%"
                    inputWidth="5%"
                    labelAlign="right"
                    title={ls('REPORTS_CONFIG_EDITOR_AUTO_FIELD_TITLE', 'Автогенерация отчёта в зависимости от заданного периода')}
                    splitter=""
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
