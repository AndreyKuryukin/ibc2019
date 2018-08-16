import React from 'react';
import PropTypes from 'prop-types';
import AlarmsContent from './AlarmsContent';
import TabPanel from '../../../components/TabPanel';
import styles from './styles.scss';
import ls from "i18n";
import { GROUP_POLICIES_ALARMS, CLIENTS_INCIDENTS_ALARMS, KQI_ALARMS } from '../constants';
import * as _ from "lodash";

const tabStyle = {
    display: 'flex',
    height: '100%',
};

class Alarms extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        filter: PropTypes.object,
        alarms: PropTypes.array,
        policies: PropTypes.array,
        notifications: PropTypes.object,
        locations: PropTypes.array,
        onChangeFilter: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        onExportXLSX: PropTypes.func,
        onFilterAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        filter: null,
        alarms: [],
        notifications: {},
        locations: [],
        policies: [],
        onChangeFilter: () => null,
        onFetchAlarms: () => null,
        onExportXLSX: () => null,
        onFilterAlarms: () => null,
        isLoading: false,
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    onTabClick = (tabId) => {
        this.props.history.push(`/alarms/${tabId}`);
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
            alarms,
            locations,
            policies,
            onChangeFilter,
            onFetchAlarms,
            onExportXLSX,
            onFilterAlarms,
            isLoading,
        } = this.props;
        const { params = {} } = match;
        const { type = GROUP_POLICIES_ALARMS } = params;

        return <div className={styles.alarmsWrapper}>
            <TabPanel
                onTabClick={this.onTabClick}
                activeTabId={type}
            >
                <div
                    id={CLIENTS_INCIDENTS_ALARMS}
                    itemId="alarms_ci_tab"
                    tabtitle={ls('CLI_TAB_TITLE', 'КИ')}
                    style={tabStyle}
                    notification={this.composeNotificationCount(_.get(this.props, 'notifications.ki'))}
                >
                    {type === CLIENTS_INCIDENTS_ALARMS && (
                        <AlarmsContent
                            type={type}
                            params={params}
                            filter={filter}
                            alarms={alarms}
                            locations={locations}
                            policies={policies}
                            onChangeFilter={onChangeFilter}
                            onFetchAlarms={onFetchAlarms}
                            onExportXLSX={onExportXLSX}
                            onFilterAlarms={onFilterAlarms}
                            isLoading={isLoading}
                        />
                    )}
                </div>
                <div
                    id={GROUP_POLICIES_ALARMS}
                    itemId="alarms_gp_tab"
                    tabtitle={ls('GROUP_POLICIES_TAB_TITLE', 'ГП')}
                    style={tabStyle}
                    notification={this.composeNotificationCount(_.get(this.props, 'notifications.gp'))}
                >
                    {type === GROUP_POLICIES_ALARMS && (
                        <AlarmsContent
                            type={type}
                            params={params}
                            filter={filter}
                            alarms={alarms}
                            locations={locations}
                            policies={policies}
                            onChangeFilter={onChangeFilter}
                            onFetchAlarms={onFetchAlarms}
                            onExportXLSX={onExportXLSX}
                            onFilterAlarms={onFilterAlarms}
                            isLoading={isLoading}
                        />
                    )}
                </div>
                <div
                    id={KQI_ALARMS}
                    itemId="alarms_kqi_tab"
                    tabtitle={ls('KQI_TAB_TITLE', 'KQI')}
                    style={tabStyle}
                    notification={this.composeNotificationCount(_.get(this.props, 'notifications.kqi'))}
                >
                    {type === KQI_ALARMS && (
                        <AlarmsContent
                            type={type}
                            params={params}
                            filter={filter}
                            alarms={alarms}
                            locations={locations}
                            policies={policies}
                            onChangeFilter={onChangeFilter}
                            onFetchAlarms={onFetchAlarms}
                            onExportXLSX={onExportXLSX}
                            onFilterAlarms={onFilterAlarms}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </TabPanel>
        </div>
    }
}

export default Alarms;
