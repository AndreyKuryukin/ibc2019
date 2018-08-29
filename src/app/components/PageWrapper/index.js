import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Navbar } from 'reactstrap';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import ls from 'i18n';
import styles from './styles.scss';
import Menu from "../Menu/index";
import Icon from '../Icon/Icon';
import rest from "../../rest/index";

const logoutIconStyle = { marginLeft: 20 };

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
        pageBlur: this.pageBlur,
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

    pageBlur = (blur) => {
        this.setState({ blur })
    };

    renderTitle = (title) => {
        if (_.isString(title)) {
            return <span>{title}</span>;
        } else if (_.isArray(title)) {
            return title.map((path, index) => {
                if (index === title.length - 1) {
                    return <span key={index}>{path}</span>;
                }
                return <span key={index}><b>{path}</b></span>;
            })
        }

    };

    getUserName = user => `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`;

    onUserNameClick = () => {
        this.props.history.push('/');
    };

    fireDownloading = (fileUrl) => {
        const fakeLink = document.createElement('a');
        const e = document.createEvent('MouseEvents');

        fakeLink.setAttribute('download', `${ls('USER_MANUAL_FILE_NAME', 'Руководство пользователя')}.pdf`);
        fakeLink.setAttribute('href', fileUrl);

        e.initEvent('click', true, true);
        fakeLink.dispatchEvent(e);
    };

    getUserManual = (href) => {
        if (href) {
            rest.get(href, undefined, undefined, { responseType: 'blob' })
                .then((response) => {
                    const fileUrl = URL.createObjectURL(response.data);
                    if (fileUrl) {
                        this.fireDownloading(fileUrl);
                    }
                    URL.revokeObjectURL(fileUrl);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };

    render() {
        const hidden = this.state.hidden || _.get(this.props, 'embedded');
        return <div className={classNames(styles.pageWrapper, { [styles.blur]: this.state.blur })}>
            <Menu menuItems={this.props.user.menu}
                  app={this.props.app}
                  onClick={this.onMenuClick}
                  className={classNames({ [styles.hidden]: hidden })}
                  path={_.get(this.props, 'location.pathname')}
                  notifications={_.get(this.props, 'notifications')}
                  onNotificationClick={this.props.onNotificationClick}
            />
            <div className={classNames(styles.workspace, { [styles.withSidebar]: !hidden })}>
                <Navbar color="faded"
                        light
                        className={classNames({
                            [styles.navBar]: true,
                            [styles.hidden]: hidden
                        })}>
                    <div className={styles.pageTitle}>
                        {this.renderTitle(this.state.pageTitle)}
                    </div>
                    <div className={styles.rightPanel}>
                        <span
                            itemId="header_user_name"
                            className={styles.userlink}
                            onClick={this.onUserNameClick}
                        >
                            {this.getUserName(this.props.user)}
                        </span>

                        <Icon
                            icon="help-icon"
                            itemId="header_load_manual"
                            title={ls('LOAD_USER_MANUAL_TITLE', 'Загрузить руководство пользователя')}
                            onClick={() => this.getUserManual('/api/v1/files/documentation.pdf')}
                            style={logoutIconStyle}
                        />

                        <Icon
                            icon="logout-icon"
                            itemId="header_logout"
                            onClick={this.props.onLogOut}
                            style={logoutIconStyle}
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


export default PageWrapper;
