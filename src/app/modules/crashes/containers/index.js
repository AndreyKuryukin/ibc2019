import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import classnames from 'classnames';
import { connect } from "react-redux";

import CrashesCmp from "../components/index";

class Crashes extends React.PureComponent {
    render () {
        return <CrashesCmp history={this.props.history}
                           match={this.props.match}
        />
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Crashes);
