import React from 'react';
import PropTypes from 'prop-types';
import AlertsContent from './AlertsContent';
import TabPanel from '../../../components/TabPanel';
import styles from './styles.scss';
import ls from "i18n";
import { ALERTS_TYPES, CLIENTS_INCIDENTS_ALERTS, GROUP_POLICIES_ALERTS, KQI_ALERTS } from '../constants';
import * as _ from "lodash";

const tabStyle = {
    display: 'flex',
    height: '100%',
};


class Alerts extends React.PureComponent {
    state = {};

    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        filter: PropTypes.object,
        alerts: PropTypes.object,
        policies: PropTypes.array,
        notifications: PropTypes.object,
        locations: PropTypes.array,
        columns: PropTypes.array,
        onChangeFilter: PropTypes.func,
        onFetchAlerts: PropTypes.func,
        onExportXLSX: PropTypes.func,
        onFilterAlerts: PropTypes.func,
        onReadNewAlert: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        filter: null,
        alerts: {},
        notifications: {},
        locations: [],
        policies: [],
        columns: [],
        onChangeFilter: () => null,
        onFetchAlerts: () => null,
        onExportXLSX: () => null,
        onFilterAlerts: () => null,
        onReadNewAlert: () => null,
        isLoading: false,
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    onTabClick = (tabId) => {
        this.props.history.push(`/alerts/${tabId}`);
    };

    getTabTitle = (type) => ({
        [CLIENTS_INCIDENTS_ALERTS]: ls('CLI_TAB_TITLE', 'КИ'),
        [GROUP_POLICIES_ALERTS]: ls('GROUP_POLICIES_TAB_TITLE', 'ГП'),
        [KQI_ALERTS]: ls('KQI_TAB_TITLE', 'KQI'),
    }[type]);


    composeNotificationCount = (notifications) => {
        if (_.isArray(notifications) && !_.isEmpty(notifications)) {
            return notifications.length > 99 ? '99+' : notifications.length;
        }
        return ''
    };

    renderTabsContent = (props) => {
        const {
            match,
            filter,
            alerts,
            locations,
            policies,
            onChangeFilter,
            onFetchAlerts,
            onExportXLSX,
            onFilterAlerts,
            onReadNewAlert,
            isLoading,
            columns,
        } = props;
        const { params = {} } = match;
        const { type: activeType = GROUP_POLICIES_ALERTS } = params;
        return ALERTS_TYPES.map(type => {
            return <div
                id={type}
                key={`alerts_${type}_tab`}
                itemId={`alerts_${type}_tab`}
                tabtitle={this.getTabTitle(type)}
                style={tabStyle}
                notification={this.composeNotificationCount(_.get(this.props, 'notifications.ki'))}
            >
                {activeType === type && (
                    <AlertsContent
                        type={type}
                        params={params}
                        filter={filter}
                        alerts={alerts}
                        columns={columns}
                        locations={locations}
                        policies={policies}
                        onChangeFilter={onChangeFilter}
                        onFetchAlerts={onFetchAlerts}
                        onExportXLSX={onExportXLSX}
                        onFilterAlerts={onFilterAlerts}
                        onReadNewAlert={onReadNewAlert}
                        isLoading={isLoading}
                    />
                )}
            </div>
        })
    };

    render() {
        const {
            match,
        } = this.props;
        const { params = {} } = match;
        const { type = GROUP_POLICIES_ALERTS } = params;

        return <div className={styles.alertsWrapper}>
            <TabPanel
                onTabClick={this.onTabClick}
                activeTabId={type}
            >
                {this.renderTabsContent(this.props)}
            </TabPanel>
        </div>
    }
}

export default Alerts;
