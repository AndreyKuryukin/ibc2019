import React from 'react';
import PropTypes from 'prop-types';
// import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import DateTimePicker from '../DateTimePicker';
import ls from 'i18n';

import styles from './styles.scss';

class DatePicker extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        inputWidth: PropTypes.number,
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
        inputWidth: null,
        disabled: false,
        valid: false,
        time: false,
        value: null,
        min: new Date(1900, 0, 1),
        max: new Date(2099, 11, 31),
        style: null,
        onChange: () => null,
    };

    render() {
        const {
            title,
            style,
            inputWidth,
            valid,
            ...rest,
        } = this.props;
        const datePickerTitles = {
            dateButton: ls('DATE_PICKER_APPLY_DATE', 'Выбрать дату'),
            timeButton: ls('DATE_PICKER_APPLY_TIME', 'Выбрать время'),
        };
        return (
            <div className={styles.datePickerWrapper}  style={style}>
                <span className={styles.datePickerTitle}>{title}</span>
                <DateTimePicker
                    inputWidth={inputWidth}
                    messages={datePickerTitles}
                    format={'DD.MM.YYYY'}
                    {...rest}
                />
            </div>
        );
    }
}

export default DatePicker;
