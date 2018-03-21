import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DateTimePicker as Picker } from 'react-widgets';

class DateTimePicker extends React.PureComponent {

    static DEFAULT_INPUT_WIDTH = 140;
    static DEFAULT_TRIGGER_WIDTH = 22;

    static propsTypes = {
        inputWidth: PropTypes.number,
    };

    static defaultProps = {
        inputWidth: DateTimePicker.DEFAULT_INPUT_WIDTH,
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    transitionClass = (inputProps) => {
        const { show } = this.state;
        return class Class extends React.PureComponent {
            render() {
                const {
                    style
                } = inputProps;
                return <div style={{ left: style.width, display: !show ? 'none' : 'block' }}
                            {...this.props}
                />
            }
        }
    };

    onToggle = (show) => {
        this.setState({ show: !!show })
    };

    render() {
        const {
            inputWidth,
            ...rest
        } = this.props;

        const width = (inputWidth ? inputWidth : DateTimePicker.DEFAULT_INPUT_WIDTH) + DateTimePicker.DEFAULT_TRIGGER_WIDTH;
        const inputProps = {
            style: {
                width: inputWidth ? inputWidth : DateTimePicker.DEFAULT_INPUT_WIDTH,
            },
        };
        return <Picker popupTransition={this.transitionClass(inputProps)}
                       inputProps={inputProps}
                       style={{ width }}
                       onToggle={this.onToggle}
                       {...rest}
        />
    }
}

export default DateTimePicker;

