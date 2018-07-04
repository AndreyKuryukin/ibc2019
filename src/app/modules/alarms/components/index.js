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
        notifications: PropTypes.object,
        locations: PropTypes.array,
        onChangeFilter: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        filter: null,
        alarms: [],
        notifications: {},
        locations: [],
        onChangeFilter: () => null,
        onFetchAlarms: () => null,
        isLoading: false,
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    onTabClick = (tabId) => {
        this.props.history.push(`/alarms/${tabId}`);
        const {filter} = this.props;
        this.props.onChangeFilter({...filter, searchText: ''})
    };

    composeNotificationCount = (notifications) => {
        if (_.isArray(notifications) && !_.isEmpty(notifications)) {
            return notifications.length
        }
        return ''
    };

    render() {
        const {
            match,
            filter,
            alarms,
            locations,
            onChangeFilter,
            onFetchAlarms,
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
                            onChangeFilter={onChangeFilter}
                            onFetchAlarms={onFetchAlarms}
                            isLoading={isLoading}
                        />
                    )}
                </div>
                <div
                    id={GROUP_POLICIES_ALARMS}
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
                            onChangeFilter={onChangeFilter}
                            onFetchAlarms={onFetchAlarms}
                            isLoading={isLoading}
                        />
                    )}
                </div>
                <div
                    id={KQI_ALARMS}
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
                            onChangeFilter={onChangeFilter}
                            onFetchAlarms={onFetchAlarms}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </TabPanel>
        </div>
    }
}

export default Alarms;
