import React from 'react';
import PropTypes from 'prop-types';

import { DateTimePicker as Picker } from 'react-widgets';
import classnames from "classnames";

import styles from'./styles.scss';


class DateTimePicker extends React.PureComponent {

    static DEFAULT_INPUT_WIDTH = 140;
    static DEFAULT_TRIGGER_WIDTH = 22;

    static propsTypes = {
        inputProps: PropTypes.object,
        width: PropTypes.number,
    };

    static defaultProps = {
        width: DateTimePicker.DEFAULT_INPUT_WIDTH + DateTimePicker.DEFAULT_TRIGGER_WIDTH,
        inputProps: {
            style: {
                width: DateTimePicker.DEFAULT_INPUT_WIDTH
            }
        },
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
            inputProps,
            width,
            ...rest
        } = this.props;
        return <Picker popupTransition={this.transitionClass(inputProps)}
                       inputProps={inputProps}
                       style={{ width }}
                       onToggle={this.onToggle}
                       {...rest}
        />
    }
}

export default DateTimePicker;

