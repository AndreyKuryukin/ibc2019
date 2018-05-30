import React from 'react';
import GroupPolicies from '../modules/GroupPolicies/containers';
import KQI from "../modules/KQI/containers";
import CI from '../modules/CI/containers';
import TabPanel from '../../../components/TabPanel';
import styles from './styles.scss';
import ls from "i18n";

const cmpMap = {
    'group-policies': GroupPolicies,
    'kqi': KQI,
    'cli': CI,
};

const tabStyle = {
    display: 'flex',
    height: '100%',
};

class Alarms extends React.PureComponent {

    render() {
        const { history, match } = this.props;
        const { params = {} } = match;
        const { subject = 'group-policies', state = 'current' } = params;
        const Component = cmpMap[subject];
        const rendered = <Component history={history}
                                    match={match}
                                    state={state}
                                    params={params}
        />;

        return <div className={styles.alarmsWrapper}>
            <TabPanel onTabClick={(tabId) => history && history.push(`${tabId}`)}
                      activeTabId={`/alarms/${subject}/${state}`}
            >
                <div id="/alarms/group-policies/current"
                     tabtitle={ls('GROUP_POLICIES_TAB_TITLE', 'Групповые политики')}
                     style={tabStyle}
                >
                    {subject === 'group-policies' && rendered}
                </div>
                <div id="/alarms/cli/current"
                     tabtitle={ls('CLI_TAB_TITLE', 'КИ')}
                     style={tabStyle}
                >
                    {subject === 'cli' && rendered}

                </div>
                <div id="/alarms/kqi/history"
                     tabtitle={ls('KQI_TAB_TITLE', 'KQI')}
                     style={tabStyle}
                >
                    {subject === 'kqi' && rendered}
                </div>
            </TabPanel>
        </div>
    }
}

export default Alarms;
