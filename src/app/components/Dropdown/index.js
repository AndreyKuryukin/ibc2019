import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';

import classnames from "classnames";

import styles from './styles.scss';

export default class DropdownComponent extends React.PureComponent {

    static propTypes = {
        dropdownClass: PropTypes.string,
        isOpen: PropTypes.bool,
        onToggle: PropTypes.func,
    };

    static defaultProps = {
        dropdownClass: '',
        isOpen: false,
        onToggle: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen !== this.state.isOpen) {
            this.setState({
                isOpen: nextProps.isOpen
            });
        }
    }

    toggle = () => {
        const isOpen = this.state.isOpen;
        this.props.onToggle(!isOpen);
    };

    render() {
        const {
            dropdownClass,
            trigger
        } = this.props;
        return (
            <Dropdown className={classnames({
                [styles.dropdownTriggerOpen]: this.state.isOpen,
                [styles.dropdownTriggerClose]: !this.state.isOpen,
            })} isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle
                    tag="div"
                    onClick={this.toggle}
                    data-toggle="dropdown"
                    aria-expanded={this.state.isOpen}
                >
                    {trigger}
                </DropdownToggle>
                <DropdownMenu className={classnames(dropdownClass)}>
                    {this.props.children}
                </DropdownMenu>
            </Dropdown>
        );
    }
}