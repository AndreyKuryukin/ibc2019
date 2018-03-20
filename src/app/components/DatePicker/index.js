import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import ls from 'i18n';

import styles from './styles.scss';

class DatePicker extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        disabled: PropTypes.bool,
        valid: PropTypes.bool,
        time: PropTypes.bool,
        value: PropTypes.instanceOf(Date),
        min: PropTypes.instanceOf(Date),
        max: PropTypes.instanceOf(Date),
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        disabled: false,
        valid: false,
        time: false,
        value: null,
        min: null,
        max: null,
        style: null,
        onChange: () => null,
    };

    render() {
        const {
            title,
            style,
            valid,
            ...rest,
        } = this.props;
        const datePickerTitles = {
            calendarButton: ls('DATE_PICKER_APPLY_DATE', 'Выбрать дату'),
            timeButton: ls('DATE_PICKER_APPLY_TIME', 'Выбрать время'),
        };
        return (
            <div className={styles.datePickerWrapper}  style={style}>
                <span className={styles.datePickerTitle}>{title}</span>
                <DateTimePicker
                    messages={datePickerTitles}
                    {...rest}
                />
            </div>
        );
    }
}

export default DatePicker;
