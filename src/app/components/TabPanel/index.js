import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';


import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

export default class Example extends React.Component {

    static propTypes = {
        activeTab: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
        onTabClick: PropTypes.func,
        children: PropTypes.arrayOf(PropTypes.shape({
            props: PropTypes.objectOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                tabTitle: PropTypes.string.isRequired
            })),
        }))
    };

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: props.activeTabId
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeTab !== this.props.activeTab) {
            this.setState({
                activeTab: nextProps.activeTab
            })
        }
    }

    renderTabs = (children = []) =>
        children.map((child, index) => <NavItem
            key={`tab-pane-${child.props.id || index}`}>
            <NavLink
                className={classnames({ active: this.state.activeTab === child.props.id })}
                onClick={() => {
                    this.toggle(child.props.id || index);
                }}
            >
                {child.props.tabTitle || index}
            </NavLink>
        </NavItem>);

    renderTabContent = (children = []) => children.map((child, index) =>
        <TabPane
            key={`tab-pane-${child.props.id || index}`}
            tabId={child.props.id || index}>
            {child}
        </TabPane>);

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            if (this.props.onTabClick) {
                this.props.onTabClick(tab);
            }
            this.setState({
                activeTab: tab
            })
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <Nav tabs >
                    {this.renderTabs(this.props.children)}
                </Nav>
                <TabContent activeTab={this.state.activeTab} className={styles.tabContent}>
                    {this.renderTabContent(this.props.children)}
                </TabContent>
            </div>
        );
    }
}