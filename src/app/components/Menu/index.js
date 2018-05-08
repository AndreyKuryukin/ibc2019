import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';
import Icon from "../Icon/Icon";

class Menu extends React.Component {

    static propTypes = {
        menuItems: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            link: PropTypes.string
        })),
        onClick: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        menuItems: [],
        onClick: () => null
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {

    }

    onItemClick = (item) => {
        this.props.onClick(item)
    };

    mapIconClass = (link) => {
        return 'groupIcon'
    };

    renderTile = (item, index) => (<div
        onClick={() => this.onItemClick(item)}
        key={index}
        className={styles.menuTile}
    >
        <Icon icon={this.mapIconClass(item.link)}/>
        {item.title}
    </div>);

    render() {
        const { menuItems, className } = this.props;
        return <div className={classNames(styles.sideMenu, className)}>
            {menuItems.map(this.renderTile)}
        </div>
    }
}


export default Menu;
