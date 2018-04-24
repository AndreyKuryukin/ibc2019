import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import classnames from 'classnames';
import { connect } from "react-redux";

class Crashes extends React.PureComponent {
    render () {
        return 'crashes/groupPolicies/current/:id'
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Crashes);
