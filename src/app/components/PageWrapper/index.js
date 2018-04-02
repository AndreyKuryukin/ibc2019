import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Navbar } from 'reactstrap';
import _ from 'lodash';

import styles from './styles.scss';
import { withRouter } from "react-router-dom";

class PageWrapper extends React.Component {

    static childContextTypes = {
        navBar: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        navBar: {
            setPageTitle: this.setPageTitle,
            hide: this.hide,
        },
        pageBlur: this.pageBlur
    });

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            blur: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (_.get(nextProps, 'location.pathname', 'a') !== _.get(this.props, 'location.pathname', 'b')) {
            this.setState({blur: false})
        }
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

    pageBlur = (blur) => {
        this.setState({blur})
    };

    render() {
        return <div className={classNames(styles.pageWrapper, {[styles.blur]: this.state.blur})}>
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
                            <div onClick={this.toggle} className={styles.qLogo}/>
                        </DropdownToggle>
                        <DropdownMenu className={styles.menuFix}>
                            {this.renderMenuItems(this.props.menu)}
                        </DropdownMenu>
                    </Dropdown>

                </div>
                <div className={styles.pageTitle}><h5>{this.state.pageTitle}</h5></div>
                <div className={styles.rightPanel}>
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
