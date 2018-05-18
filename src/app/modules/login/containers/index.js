import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';


import LoginComponent from '../components';
import { signInSuccess } from '../actions/index';
import rest, { signIn } from '../../../rest/index';
import { ERRORS } from "../../../costants/errors";
import ls from "i18n";
import { LOGIN_REQUEST, SIGN_IN_URL } from "../../../costants/login";
import { validateForm } from "../../../util/validation";
import { fetchActiveUserSuccess } from "../../../actions/index";

class Login extends React.PureComponent {

    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired,
        fetchUserSuccess: PropTypes.func.isRequired,
    };

    validationConfig = {
        login: {
            required: true
        },
        password: {
            required: true
        }
    };

    componentDidMount() {
        this.context.navBar.hide();
    }

    constructor() {
        super();
        this.state = {};
    }

    onSubmit = (login, password) => {
        const loginForm = { login, password };
        const errors = validateForm(loginForm, this.validationConfig);
        if (!_.isEmpty(errors)) {
            this.setState({ errors });
        } else {
            this.setState({ loading: true, errors: {} });
            rest.post(SIGN_IN_URL, {
                [LOGIN_REQUEST.LOGIN]: login,
                [LOGIN_REQUEST.PASSWORD]: password
            })
                .then(() => {
                    this.context.notifications.close('login-failed');
                    return rest.get('api/v1/user/current');
                })
                .then((userResp) => {
                    this.setState({ loading: false });
                    const user = userResp.data;
                    this.context.fetchUserSuccess(user);
                    this.props.history.push('/roles');
                })
                .catch((error) => {
                    this.context.notifications.notify({
                        title: ls('LOGIN_ERROR_FIELD', 'Неверные учётные данные:'),
                        message: ls('LOGIN_ERROR_FIELD', 'Логин и пароль не совпадают'),
                        type: 'CRITICAL',
                        code: 'login-failed'
                    });
                    this.setState({ errors: _.get(error, `data.${ERRORS}`) });
                });
        }
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
    onFetchUserSuccess: user => dispatch(fetchActiveUserSuccess(user)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
