import React from 'react';
import PropTypes from 'prop-types';

const cmpMap = {
    'group-policies': 'GroupPolicies',
    'kqi': 'GroupPolicies'
};

class CrashesCmp extends React.PureComponent {

    render () {
        const { params = {} } = this.props.match;
        const {subject = 'group-policies'} = params;
        const Component = cmpMap[subject];
        return <div>
            {Component}
        </div>
    }
}

export default CrashesCmp;
