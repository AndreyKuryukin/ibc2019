import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import LoginComponent from '../components';
import { signInSuccess } from '../actions/index';
import rest, { signIn } from '../../../rest/index';
import { ERRORS } from "../../../costants/errors";
import ls, { setLanguageMap } from "i18n";
import { LOGIN_REQUEST, SIGN_IN_URL, LANGUAGES } from "../../../costants/login";
import { validateForm } from "../../../util/validation";
import { fetchActiveUserSuccess, setLanguage } from '../../../actions';

class Login extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired,
        fetchUserSuccess: PropTypes.func.isRequired,
        language: PropTypes.string,
    };

    static propTypes = {
        language: PropTypes.string,
        onLanguageChange: PropTypes.func,
    };

    static defaultProps = {
        language: LANGUAGES.RUSSIAN,
        onLanguageChange: () => null,
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
        setLanguageMap(null);

        this.context.navBar.hide();
    }

    constructor() {
        super();
        this.state = {};
    }

    onInput = () => {
        this.context.notifications.close('login-failed');
    };

    onSubmit = (login, password, language) => {
        const loginForm = { login, password };
        const errors = validateForm(loginForm, this.validationConfig);
        if (!_.isEmpty(errors)) {
            this.setState({ errors });
        } else {
            this.setState({ loading: true, errors: {} });
            rest.post(SIGN_IN_URL, {
                [LOGIN_REQUEST.LOGIN]: login,
                [LOGIN_REQUEST.PASSWORD]: password,
                [LOGIN_REQUEST.LANGUAGE]: language,
            })
                .then(() => {
                    this.context.notifications.close('login-failed');
                    return rest.get('api/v1/user/current');
                })
                .then((userResp) => {
                    const user = userResp.data;
                    this.context.fetchUserSuccess(user);
                    this.setState({ loading: false });
                    this.props.history.push('/');
                })
                .catch((error) => {
                    this.context.notifications.notify({
                        title: ls('LOGIN_ERROR_FIELD', 'Неверные учётные данные:'),
                        message: ls('LOGIN_ERROR_FIELD', 'Логин и пароль не совпадают'),
                        type: 'CRITICAL',
                        code: 'login-failed'
                    });
                    this.setState({ loading: false, errors: _.get(error, `data.${ERRORS}`) });
                });
        }
    };

    render() {
        return (
            <LoginComponent
                onSubmit={this.onSubmit}
                onInput={this.onInput}
                loading={this.state.loading}
                errors={this.state.errors}
                language={this.props.language}
                onLanguageChange={this.props.onLanguageChange}
            />
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

const mapDispatchToProps = dispatch => ({
    onLoginSuccess: (...success) => dispatch(signInSuccess(...success)),
    onFetchUserSuccess: user => dispatch(fetchActiveUserSuccess(user)),
    onLanguageChange: language => dispatch(setLanguage(language)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
