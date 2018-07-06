import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';


import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

const tabPaneStyle = { height: '100%' };
const navStyle = { position: 'relative' };

export default class TabPanel extends React.Component {

    static propTypes = {
        activeTabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onTabClick: PropTypes.func,
        children: PropTypes.arrayOf(PropTypes.shape({
            props: PropTypes.shape({
                id: PropTypes.string.isRequired,
                tabtitle: PropTypes.string.isRequired
            }),
        }))
    };

    constructor(props) {
        super(props);
        this.state = {
            activeTabId: props.activeTabId,
            underlineLeft: 0,
            underlineWidth: 0,
        };
    }

    componentDidMount() {
        const underlineLeft = this.activeTab.offsetLeft;
        const { width: underlineWidth } = this.activeTab.getBoundingClientRect();
        this.setState({
            underlineLeft,
            underlineWidth,
        });
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeTabId !== this.props.activeTabId) {
            this.setState({
                activeTabId: nextProps.activeTabId,
            });
        }
    }



    setActiveTabRef = (tab, isActive) => {
        if (isActive) {
            this.activeTab = tab;
            if (tab) {
                const underlineLeft = this.activeTab.offsetLeft;
                const { width: underlineWidth } = this.activeTab.getBoundingClientRect();
                if (this.state.underlineLeft !== underlineLeft && this.state.underlineWidth !== underlineWidth) {
                    this.setState({
                        underlineLeft,
                        underlineWidth,
                    });
                }
            }
        }
    };

    renderTabTitle = (title, notification) => {
        return <div className={styles.navTitle}>
            {title}
            <span>
                {notification}
            </span>
        </div>
    };

    renderTabs = (children = [], notification) =>
        children.map((child, index) => child && <NavItem
                className={classnames({
                    [styles.active]: this.state.activeTabId === child.props.id,
                })}
                key={`tab-pane-${child.props.id || index}`}
            >
                <NavLink
                    onClick={this.toggle.bind(this, child.props.id || index)}
                    innerRef={tab => this.setActiveTabRef(tab, this.state.activeTabId === child.props.id)}
                >
                    {this.renderTabTitle(child.props.tabtitle || index, child.props.notification)}
                </NavLink>
            </NavItem>
        );

    renderTabContent = (children = []) => children.map((child, index) =>
        child && this.state.activeTabId === child.props.id && <TabPane
            key={`tab-pane-${child.props.id || index}`}
            tabId={child.props.id || index}
            style={tabPaneStyle}>
            {child}
        </TabPane>
    );



    toggle(tab, event) {
        if (this.state.activeTabId !== tab) {
            const underlineLeft = event.currentTarget.offsetLeft;
            const { width: underlineWidth } = event.currentTarget.getBoundingClientRect();
            if (this.props.onTabClick) {
                this.props.onTabClick(tab);
            }
            this.setState({
                activeTabId: tab,
                underlineLeft,
                underlineWidth,
            });
        }
    }

    render() {
        return (
            <div className={classnames(styles.tabsWrapper, this.props.className)}>
                <div className={styles.navPanel}>
                    <Nav style={navStyle} tabs>
                        {this.renderTabs(this.props.children)}
                        <div className={styles.underline}
                             style={{ left: this.state.underlineLeft, width: this.state.underlineWidth }}/>
                    </Nav>
                </div>
                <TabContent activeTab={this.state.activeTabId} className={styles.tabContent}>
                    {this.renderTabContent(this.props.children)}
                </TabContent>
            </div>
        );
    }
}