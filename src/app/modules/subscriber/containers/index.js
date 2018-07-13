import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

import SubscriberCmp from '../components';

class Subscriber extends React.PureComponent {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <SubscriberCmp user={this.props.user}/>
    }
}

const mapStateToProps = state => ({
    user: _.get(state, 'user')
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscriber);
