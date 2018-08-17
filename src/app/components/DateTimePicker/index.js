import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DateTimePicker as Picker } from 'react-widgets';
import classnames from 'classnames';

class DateTimePicker extends React.PureComponent {

    static DEFAULT_INPUT_WIDTH = 140;
    static DEFAULT_TRIGGER_WIDTH = 22;
    static MIN_DATE = new Date(1900, 0, 1);
    static MAX_DATE = new Date(2099, 11, 31);

    static propsTypes = {
        inputStyle: PropTypes.object,
        itemId: PropTypes.string,
        title: PropTypes.string,
        inputWidth: PropTypes.number,
        min: PropTypes.instanceOf(Date),
        max: PropTypes.instanceOf(Date),
        disabled: PropTypes.bool,
        date: PropTypes.bool,
        time: PropTypes.bool,
        valid: PropTypes.bool,
    };

    static defaultProps = {
        inputStyle: null,
        itemId: '',
        title: '',
        inputWidth: DateTimePicker.DEFAULT_INPUT_WIDTH,
        min: new Date(1900, 0, 1),
        max: new Date(2099, 11, 31),
        disabled: false,
        date: true,
        time: false,
        valid: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        if (this.props.itemId) {
            const [dateBtn, timeBtn] = document.querySelectorAll(`.${this.props.itemId} .rw-btn-select`);

            if (dateBtn) {
                dateBtn.setAttribute('itemId', `${this.props.itemId}_select_date`);
            }

            if (timeBtn) {
                timeBtn.setAttribute('itemId', `${this.props.itemId}_select_time`);
            }
        }
    }

    transitionClass = (inputProps) => {
        const { show } = this.state;
        const { style } = inputProps;
        return class Class extends React.PureComponent {
            render() {
                const { className, children } = this.props;
                const classes = classnames(
                    className,
                    { ['rw-time-popup']: className.indexOf('calendar') === -1 },
                    { ['rw-date-popup']: className.indexOf('calendar') !== -1 },
                );
                const displayByClass = classes.indexOf(show) !== -1 ? 'block' : 'none';
                return (
                    <div
                        style={{ left: style.width, display: !show ? 'none' : displayByClass }}
                        className={classes}
                    >{children}</div>
                );
            }
        }
    };

    onToggle = (show) => {
        this.setState({ show })
    };

    render() {
        const {
            inputStyle,
            inputWidth,
            time,
            date,
            min,
            max,
            valid,
            itemId,
            id,
            title,
            ...rest
        } = this.props;

        const width = (inputWidth ? inputWidth : DateTimePicker.DEFAULT_INPUT_WIDTH) + (+date + +time)*DateTimePicker.DEFAULT_TRIGGER_WIDTH;
        const inputProps = {
            itemId: `${itemId}_field`,
            title,
            style: {
                ...inputStyle,
                width: inputWidth ? inputWidth : DateTimePicker.DEFAULT_INPUT_WIDTH,
            },
        };
        const minDate = min || DateTimePicker.MIN_DATE;
        const maxDate = max || DateTimePicker.MAX_DATE;
        const invalid = valid !== null && !valid;

        return <Picker popupTransition={this.transitionClass(inputProps)}
                       className={classnames(itemId, { 'invalid': invalid })}
                       inputProps={inputProps}
                       style={{ width }}
                       onToggle={this.onToggle}
                       time={time}
                       date={date}
                       open={this.state.show}
                       min={minDate}
                       max={maxDate}
                       {...rest}
        />
    }
}

export default DateTimePicker;

