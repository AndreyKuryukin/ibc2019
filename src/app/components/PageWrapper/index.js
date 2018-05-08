import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Navbar } from 'reactstrap';
import _ from 'lodash';

import styles from './styles.scss';
import { withRouter } from "react-router-dom";
import Menu from "../Menu/index";

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

    static propTypes = {
        user: PropTypes.object,
    };

    static defaultProps = {
        user: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            blur: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (_.get(nextProps, 'location.pathname', 'a') !== _.get(this.props, 'location.pathname', 'b')) {
            this.setState({ blur: false })
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

    // renderMenuItems = (items = []) => items.map((item, index) => <DropdownItem key={`menu-item-${index}`}
    //                                                                            onClick={() => this.onMenuClick(item)}>{item.title}</DropdownItem>);

    pageBlur = (blur) => {
        this.setState({ blur })
    };

    getUserName = user => `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`;

    render() {
        return <div className={classNames(styles.pageWrapper, { [styles.blur]: this.state.blur })}>
            <Menu menuItems={this.props.user.menu}
                  onClick={this.onMenuClick}
                  className={classNames({ [styles.hidden]: this.state.hidden })}
            />
            <div className={styles.workspace}>
                <Navbar color="faded"
                        light
                        className={classNames({
                            [styles.navBar]: true,
                            [styles.hidden]: this.state.hidden
                        })}>
                    <div className={styles.qLogo}/>
                    <div className={styles.pageTitle}><h5>{this.state.pageTitle}</h5></div>
                    <div className={styles.rightPanel}>
                        <a href="/">{this.getUserName(this.props.user)}</a>
                    </div>
                </Navbar>
                <div className={styles.pageContent}>
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    user: state.user,
});


export default withRouter(connect(mapStateToProps, null)(PageWrapper));
