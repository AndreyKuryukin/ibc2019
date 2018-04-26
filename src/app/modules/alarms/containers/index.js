import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import AlarmsCmp from "../components/index";

class Alarms extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            history: this.props.history,
            match: this.props.match,
            location: this.props.location,
        };
    }

    render () {
        return (
            <AlarmsCmp
                history={this.props.history}
                match={this.props.match}
            />
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
