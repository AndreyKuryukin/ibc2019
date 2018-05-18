import React from 'react';
import GroupPolicies from '../modules/GroupPolicies/containers';
import KQI from "../modules/KQI/containers/index";
import styles from './styles.scss';

const cmpMap = {
    'group-policies': GroupPolicies,
    'kqi': KQI
};

class Alarms extends React.PureComponent {

    render () {
        const { params = {} } = this.props.match;
        const { subject = 'group-policies', state = 'current' } = params;
        const Component = cmpMap[subject];
        return <div className={styles.alarmsWrapper}>
            <Component history={this.props.history}
                       match={this.props.match}
                       state={state}
                       params={params}
            />
        </div>
    }
}

export default Alarms;