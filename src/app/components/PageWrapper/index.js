import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Navbar } from 'reactstrap';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import styles from './styles.scss';
import { withRouter } from "react-router-dom";
import Menu from "../Menu/index";
import Icon from '../Icon/Icon';
import rest from '../../rest';
import { resetActiveUserSuccess } from '../../actions';

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
        onLogOut: PropTypes.func,
    };

    static defaultProps = {
        user: null,
        onLogOut: () => null,
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

    onLogOut = () => {
        rest.post('api/v1/auth/logout')
            .then(() => {
                this.props.onLogOut();
                this.props.history.push('/login');
            })
            .catch((e) => {
                console.error(e);
            });
    };

    setPageTitle = (title) => this.setState({ pageTitle: title, hidden: false });

    pageBlur = (blur) => {
        this.setState({ blur })
    };

    renderTitle = (title) => {
        if (_.isString(title)) {
            return <h6>{title}</h6>;
        } else if (_.isArray(title)) {
            return title.map((path, index) => {
                if (index === title.length - 1) {
                    return <h6>{path}</h6>;
                }
                return <h6><b>{path}</b></h6>;
            })
        }

    };

    getUserName = user => `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`;

    render() {
        return <div className={classNames(styles.pageWrapper, { [styles.blur]: this.state.blur })}>
            <Menu menuItems={this.props.user.menu}
                  onClick={this.onMenuClick}
                  className={classNames({ [styles.hidden]: this.state.hidden })}
                  path={_.get(this.props, 'location.pathname')}
            />
            <div className={styles.workspace}>
                <Navbar color="faded"
                        light
                        className={classNames({
                            [styles.navBar]: true,
                            [styles.hidden]: this.state.hidden
                        })}>
                    <div className={styles.qLogo}/>
                    <div className={styles.pageTitle}>
                        {this.renderTitle(this.state.pageTitle)}
                    </div>
                    <div className={styles.rightPanel}>
                        <a href="/">{this.getUserName(this.props.user)}</a>
                        <Icon
                            icon="userIcon"
                            onClick={this.onLogOut}
                        />
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

const mapDispatchToProps = (dispatch, props) => ({
    onLogOut: () => dispatch(resetActiveUserSuccess()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageWrapper));
