import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Popover, PopoverBody } from 'reactstrap';

import styles from './styles.scss';
import Icon from "../Icon/Icon";
import * as _ from "lodash";
import ls from "i18n";

const iconMap = {
    'kqi': 'menu-icon-kqi'
}

class Menu extends React.Component {

    static propTypes = {
        menuItems: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            link: PropTypes.string
        })),
        onClick: PropTypes.func,
        className: PropTypes.string,
        path: PropTypes.string,
        notifications: PropTypes.object,
        app: PropTypes.object
    };

    static defaultProps = {
        menuItems: [],
        notifications: [],
        path: '',
        onClick: () => null,
        app: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            notificationPopup: false
        }
    }

    onItemClick = (item) => {
        this.props.onClick(item)
    };

    mapIconClass = (name, active) => `menu-icon-${name}${active ? '-active' : ''}`;

    getFeature = (path) => path.split('/')[1] || 'landing';

    composeNotificationsCount = notificationCount => notificationCount > 99 ? '99+' : `${notificationCount}`;

    toggle = (item) => {
        this.setState({
            notificationPopup: this.state.notificationPopup === item ? '' : item
        });
    };

    renderNotifications = (notifications) => {
        const linkMap = {
            'gp': 'gp',
            'kqi': 'kqi',
            'ki': 'ci'
        };
        return <div className={styles.notificationCountPopup}>
            {_.reduce(notifications, (result, msgs = [], type) => {
                if (msgs.length > 0) {
                    result.push(<div className={styles.type}
                                     key={`item-${type}`}
                                     onClick={() => {
                                         this.onItemClick({ link: `/alarms/${linkMap[type]}` });
                                         this.toggle()
                                     }}
                    >
                        {ls(`ALERTS_TYPE_${type.toUpperCase()}`)}
                        <span className={styles.count}>
                        {msgs.length}
                    </span>
                    </div>);
                }

                return result
            }, [])}
        </div>
    };

    renderTile = (item, index, feature) => {
        const clearLink = this.getFeature(item.link);
        const isActive = clearLink === feature;
        //todo: Заменить частный случай на общий
        const notificationCount = clearLink === 'alarms' ? _.get(this.props, `notifications.${'alerts'}.count`, 0) : 0;
        const notifications = clearLink === 'alarms' ? _.omit(_.get(this.props, `notifications.${'alerts'}`, {}), ['count']) : {};
        return (<div
            itemId={`menu_${clearLink}`}
            id={`menu-tile-${clearLink}`}
            onClick={() => this.onItemClick(item)}
            key={index}
            className={classNames(styles.menuTile, { [styles.activeTile]: isActive })}
        >
            <div>
                <Icon icon={this.mapIconClass(clearLink, isActive)}/>
                {notificationCount > 0 &&
                <span className={styles.notificationCount}
                      onClick={(e) => {
                          e.stopPropagation();
                          this.toggle(clearLink)
                      }}
                >
                    {this.composeNotificationsCount(notificationCount)}
                </span>}
            </div>
            <span className={styles.tileTitle}>{ls(`${item.id}_SIDEMENU_TITLE`, item.defaultTitle)}</span>
            <Popover placement={'right'}
                     isOpen={this.state.notificationPopup === clearLink}
                     target={`menu-tile-${clearLink}`}
                     toggle={this.toggle}>
                <PopoverBody>
                    {this.renderNotifications(notifications)}
                </PopoverBody>
            </Popover>
        </div>)
    };

    render() {
        const { menuItems = [], className, path, app } = this.props;
        const feature = this.getFeature(path);
        return <div className={classNames(styles.sideMenu, className)}>
            {_.isArray(menuItems) && menuItems.map((item, index) => this.renderTile(item, index, feature))}
            <div className={classNames(styles.appVersion)}>
                {`FE: v. ${app.version}`}
            </div>
        </div>
    }
}


export default Menu;
