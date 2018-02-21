import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';

import styles from './styles.scss';
import { withRouter } from "react-router-dom";

class PageWrapper extends React.Component {

    static childContextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {};

    static defaultProps = {};

    getChildContext = () => ({
        navBar: {
            setPageTitle: this.setPageTitle,
            hide: this.hide,
        }
    });

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    hide = () => {
        this.setState({ hidden: true });
    };

    onMenuClick = (item) => {
        this.props.history.push(item.link)
    };

    setPageTitle = (title) => this.setState({ pageTitle: title, hidden: false });

    renderMenuItems = (items = []) => items.map(item => <DropdownItem
        onClick={() => this.onMenuClick(item)}>{item.title}</DropdownItem>);

    render() {
        return <div className={styles.pageWrapper}>
            <Navbar color="faded"
                    light
                    className={classNames({
                        [styles.navBar]: true,
                        [styles.hidden]: this.state.hidden
                    })}>
                <div className={styles.menuWrapper}>
                    <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                        <DropdownToggle tag="span"
                                        onClick={this.toggle}
                                        data-toggle="dropdown"
                                        aria-expanded={this.state.isOpen}>
                            <NavbarToggler onClick={this.toggle} className="mr-2"/>
                        </DropdownToggle>
                        <DropdownMenu className={styles.menuFix}>
                            {this.renderMenuItems(this.props.menu)}
                        </DropdownMenu>
                    </Dropdown>
                    <h3 className={styles.pageTitle}>{this.state.pageTitle}</h3>
                </div>
            </Navbar>
            <div className={styles.pageContent}>
                {this.props.children}
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    menu: state.user.menu,
});



export default withRouter(connect(mapStateToProps, null)(PageWrapper));
