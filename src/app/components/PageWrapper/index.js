import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Navbar } from 'reactstrap';

import styles from './styles.scss';
import { withRouter } from "react-router-dom";

class PageWrapper extends React.Component {

    static childContextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    getChildContext = () => ({
        navBar: {
            setPageTitle: this.setPageTitle,
            hide: this.hide,
        }
    });

    static propTypes = {};

    static defaultProps = {};

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

    renderMenuItems = (items = []) => items.map((item, index) => <DropdownItem key={`menu-item-${index}`}
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
                        <DropdownToggle tag="div"
                                        onClick={this.toggle}
                                        data-toggle="dropdown"
                                        aria-expanded={this.state.isOpen}>
                            <div onClick={this.toggle} className={styles.qLogo}><h3>Q'ligent logo</h3></div>
                        </DropdownToggle>
                        <DropdownMenu className={styles.menuFix}>
                            {this.renderMenuItems(this.props.menu)}
                        </DropdownMenu>
                    </Dropdown>
                    <div className={styles.pageTitle}><h5>{this.state.pageTitle}</h5></div>
                </div>
                <div className={styles.leftPanel}>
                    <a href="/users/username">Username</a>
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
