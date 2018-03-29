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
        inputWidth: PropTypes.number,
        min: PropTypes.instanceOf(Date),
        max: PropTypes.instanceOf(Date),
        date: PropTypes.bool,
        time: PropTypes.bool,
    };

    static defaultProps = {
        inputWidth: DateTimePicker.DEFAULT_INPUT_WIDTH,
        min: new Date(1900, 0, 1),
        max: new Date(2099, 11, 31),
        date: true,
        time: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
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
            inputWidth,
            time,
            date,
            min,
            max,
            ...rest
        } = this.props;

        const width = (inputWidth ? inputWidth : DateTimePicker.DEFAULT_INPUT_WIDTH) + (+date + +time)*DateTimePicker.DEFAULT_TRIGGER_WIDTH;
        const inputProps = {
            style: {
                width: inputWidth ? inputWidth : DateTimePicker.DEFAULT_INPUT_WIDTH,
            },
        };
        const minDate = min || DateTimePicker.MIN_DATE;
        const maxDate = max || DateTimePicker.MAX_DATE;

        return <Picker popupTransition={this.transitionClass(inputProps)}
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

