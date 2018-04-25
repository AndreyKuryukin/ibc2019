import React from 'react';
import PropTypes from 'prop-types';
import GroupPolicies from '../modules/GroupPolicies/containers';

const cmpMap = {
    'group-policies': GroupPolicies,
    'kqi': 'kqi'
};

class CrashesCmp extends React.PureComponent {

    render () {
        const { params = {} } = this.props.match;
        const { subject = 'group-policies', state } = params;
        const Component = cmpMap[subject];
        return (
            <div>
                <Component
                    state={state}
                    params={params}
                />
            </div>
        );
    }
}

export default CrashesCmp;
