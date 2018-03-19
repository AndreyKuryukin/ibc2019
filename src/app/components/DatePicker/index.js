import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-date-picker';
import ls from 'i18n';

import styles from './styles.scss';

class DatePicker extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        disabled: PropTypes.bool,
        value: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date),
        maxDate: PropTypes.instanceOf(Date),
        style: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        disabled: false,
        value: null,
        minDate: null,
        maxDate: null,
        style: null,
        onChange: () => null,
    };

    render() {
        const {
            title,
            style,
            ...rest,
        } = this.props;
        return (
            <div className={styles.datePickerWrapper}  style={style}>
                <span className={styles.datePickerTitle}>{title}</span>
                <DateTimePicker
                    {...rest}
                />
            </div>
        );
    }
}

export default DatePicker;
