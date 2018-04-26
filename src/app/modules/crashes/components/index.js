import React from 'react';
import PropTypes from 'prop-types';
import GroupPolicies from '../modules/GroupPolicies/containers';
import KQI from "../modules/KQI/containers/index";
import styles from './styles.scss';

const cmpMap = {
    'group-policies': GroupPolicies,
    'kqi': KQI
};

class CrashesCmp extends React.PureComponent {

    render () {
        const { params = {} } = this.props.match;
        const { subject = 'group-policies', state } = params;
        const Component = cmpMap[subject];
        return <div className={styles.crashesWrapper}>
            <Component history={this.props.history}
                       match={this.props.match}
                       state={state}
                       params={params}
            />
        </div>
    }
}

export default CrashesCmp;
