import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import ls from 'i18n';

class DatePicker extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string,
        locale: PropTypes.string,
        value: PropTypes.instanceOf(Date),
        minValue: PropTypes.instanceOf(Date),
        disabled: PropTypes.bool,
        time: PropTypes.bool,
        valid: PropTypes.bool,
        format: PropTypes.string,
        calendar: PropTypes.bool,
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        // locale:
        value: null,
        minValue: null,
        disabled: false,
        time: false,
        valid: true,
        format: 'DD.MM.YYYY HH:mm:ss',
        calender: true,
        style: null,
        onChange: () => null,
    };

    render() {
        const {
            id,
            title,
            locale,
            value,
            onChange,
            minValue,
            disabled,
            time,
            valid,
            format,
            calendar,
            style,
        } = this.props;
        const datePickerTitles = {
            dateButton: ls('DATE_FILTER_APPLY_DATE', 'Выбрать дату'),
            timeButton: ls('DATE_FILTER_APPLY_TIME', 'Выбрать время'),
        };
        return (
            <div styleName="wrapper">
                <span>{title}</span>
                <DateTimePicker
                    style={style}
                    id={id}
                    className={''}
                    time={time}
                    calendar={calendar}
                    culture={locale}
                    step={15}
                    value={value}
                    onChange={onChange}
                    min={minValue}
                    disabled={disabled}
                    messages={datePickerTitles}
                    format={format}
                />
            </div>
        );
    }
}

export default DatePicker;
