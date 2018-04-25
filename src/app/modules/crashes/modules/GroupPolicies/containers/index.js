import React from 'react';
import { connect } from 'react-redux';
import GroupPoliciesComponent from '../components/index';

class GroupPolicies extends React.PureComponent {
    render () {
        return (
            <GroupPoliciesComponent {...this.props} />
        );
    }
}

export default connect(null, null)(GroupPolicies);
