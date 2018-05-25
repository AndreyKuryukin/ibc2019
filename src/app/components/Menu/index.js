import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';
import Icon from "../Icon/Icon";

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
    };

    static defaultProps = {
        menuItems: [],
        path: '',
        onClick: () => null
    };

    constructor(props) {
        super(props);
    }

    onItemClick = (item) => {
        this.props.onClick(item)
    };

    mapIconClass = (name, active) => `menu-icon-${name}${active ? '-active' : ''}`;

    getFeature = (path) => path.split('/')[1];

    renderTile = (item, index, feature) => {
        const clearLink = this.getFeature(item.link);
        const isActive = clearLink === feature;
        return (<div
            onClick={() => this.onItemClick(item)}
            key={index}
            className={classNames(styles.menuTile, { [styles.activeTile]: isActive })}
        >
            <Icon icon={this.mapIconClass(clearLink, isActive)}/>
            <span className={styles.tileTitle}>{item.title}</span>
        </div>)
    };

    render() {
        const { menuItems = [], className, path } = this.props;
        const feature = this.getFeature(path);
        return <div className={classNames(styles.sideMenu, className)}>
            {menuItems.map((item, index) => this.renderTile(item, index, feature))}
        </div>
    }
}


export default Menu;
