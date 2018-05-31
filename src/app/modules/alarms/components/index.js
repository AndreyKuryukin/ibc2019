import React from 'react';
import PropTypes from 'prop-types';
import AlarmsContent from '../modules/AlarmsContent/containers';
import TabPanel from '../../../components/TabPanel';
import styles from './styles.scss';
import ls from "i18n";
import { GROUP_POLICIES_ALARMS, CLIENTS_INCIDENTS_ALARMS, KQI_ALARMS } from '../modules/AlarmsContent/constants';

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
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    onTabClick = (tabId) => {
        this.props.history.push(`/alarms/${tabId}`);
    };

    render() {
        const { match } = this.props;
        const { params = {} } = match;
        const { type = GROUP_POLICIES_ALARMS } = params;

        return <div className={styles.alarmsWrapper}>
            <TabPanel
                onTabClick={this.onTabClick}
                activeTabId={type}
            >
                <div
                    id={GROUP_POLICIES_ALARMS}
                    tabtitle={ls('GROUP_POLICIES_TAB_TITLE', 'Групповые политики')}
                    style={tabStyle}
                >
                    {type === GROUP_POLICIES_ALARMS && (
                        <AlarmsContent
                            type={type}
                            params={params}
                        />
                    )}
                </div>
                <div
                    id={CLIENTS_INCIDENTS_ALARMS}
                    tabtitle={ls('CLI_TAB_TITLE', 'КИ')}
                    style={tabStyle}
                >
                    {type === CLIENTS_INCIDENTS_ALARMS && (
                        <AlarmsContent
                            type={type}
                            params={params}
                        />
                    )}
                </div>
                <div
                    id={KQI_ALARMS}
                    tabtitle={ls('KQI_TAB_TITLE', 'KQI')}
                    style={tabStyle}
                >
                    {type === KQI_ALARMS && (
                        <AlarmsContent
                            type={type}
                            params={params}
                        />
                    )}
                </div>
            </TabPanel>
        </div>
    }
}

export default Alarms;
