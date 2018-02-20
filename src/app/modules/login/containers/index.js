import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import LoginComponent from '../components';
import { signInSuccess } from '../actions/index';
import { signIn } from '../../../rest/index';
import { ERRORS } from "../../../costants/errors";


class Login extends React.PureComponent {
    constructor() {
        super();
        this.state = {};
    }

    onSubmit = (...loginPassword) => {
        this.setState({ loading: true });
        signIn(...loginPassword)
            .then((userName) => {
                this.setState({ loading: false });
                this.props.onLoginSuccess(userName);
                window.location.href = '/roles';
            }).catch((error) => {
            this.setState({ errors: _.get(error, `data.${ERRORS}`) });
        });
    };

    render() {
        return (<LoginComponent
            onSubmit={this.onSubmit}
            loading={this.state.loading}
            errors={this.state.errors}
        />);
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    onLoginSuccess: (...success) => dispatch(signInSuccess(...success)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
