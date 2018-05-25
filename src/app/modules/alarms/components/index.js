import React from 'react';
import GroupPolicies from '../modules/GroupPolicies/containers';
import KQI from "../modules/KQI/containers/index";
import TabPanel from '../../../components/TabPanel';
import styles from './styles.scss';
import ls from "i18n";

const cmpMap = {
    'group-policies': GroupPolicies,
    'kqi': KQI
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
                     tabTitle={ls('GROUP_POLICIES_TAB_TITLE', 'Групповые политики')}
                >
                    {subject === 'group-policies' && rendered}
                </div>
                <div id="/alarms/cli/current"
                     tabTitle={ls('CLI_TAB_TITLE', 'КИ')}
                >
                    {subject === 'cli' && rendered}

                </div>
                <div id="/alarms/kqi/history"
                     tabTitle={ls('KQI_TAB_TITLE', 'KQI')}
                >
                    {subject === 'kqi' && rendered}
                </div>
            </TabPanel>
        </div>
    }
}

export default Alarms;
