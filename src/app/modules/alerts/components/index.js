import React from 'react';
import PropTypes from 'prop-types';
import AlertsContent from './AlertsContent';
import TabPanel from '../../../components/TabPanel';
import styles from './styles.scss';
import ls from "i18n";
import { GROUP_POLICIES_ALERTS, CLIENTS_INCIDENTS_ALERTS, KQI_ALERTS } from '../constants';
import * as _ from "lodash";

const tabStyle = {
    display: 'flex',
    height: '100%',
};

class Alerts extends React.PureComponent {
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
        const { filter } = this.props;
        this.props.onChangeFilter(filter);
    };

    composeNotificationCount = (notifications) => {
        if (_.isArray(notifications) && !_.isEmpty(notifications)) {
            return notifications.length > 99 ? '99+' : notifications.length;
        }
        return ''
    };

    render() {
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
        } = this.props;
        const { params = {} } = match;
        const { type = GROUP_POLICIES_ALERTS } = params;

        return <div className={styles.alertsWrapper}>
            <TabPanel
                onTabClick={this.onTabClick}
                activeTabId={type}
            >
                <div
                    id={CLIENTS_INCIDENTS_ALERTS}
                    itemId="alerts_ci_tab"
                    tabtitle={ls('CLI_TAB_TITLE', 'КИ')}
                    style={tabStyle}
                    notification={this.composeNotificationCount(_.get(this.props, 'notifications.ki'))}
                >
                    {type === CLIENTS_INCIDENTS_ALERTS && (
                        <AlertsContent
                            type={type}
                            params={params}
                            filter={filter}
                            alerts={alerts}
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
                <div
                    id={GROUP_POLICIES_ALERTS}
                    itemId="alerts_gp_tab"
                    tabtitle={ls('GROUP_POLICIES_TAB_TITLE', 'ГП')}
                    style={tabStyle}
                    notification={this.composeNotificationCount(_.get(this.props, 'notifications.gp'))}
                >
                    {type === GROUP_POLICIES_ALERTS && (
                        <AlertsContent
                            type={type}
                            params={params}
                            filter={filter}
                            alerts={alerts}
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
                <div
                    id={KQI_ALERTS}
                    itemId="alerts_kqi_tab"
                    tabtitle={ls('KQI_TAB_TITLE', 'KQI')}
                    style={tabStyle}
                    notification={this.composeNotificationCount(_.get(this.props, 'notifications.kqi'))}
                >
                    {type === KQI_ALERTS && (
                        <AlertsContent
                            type={type}
                            params={params}
                            filter={filter}
                            alerts={alerts}
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
            </TabPanel>
        </div>
    }
}

export default Alerts;
