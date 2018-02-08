import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {TextField} from 'qreact';
import ls from '../../../../i18n';
import styles from './login.scss';

console.log(TextField);

class Login extends React.PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func,
        login: PropTypes.string,
        password: PropTypes.string,
    };

    static defaultProps = {
        onSubmit: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            password: props.password,
        }
    }

    onSubmit = (e) => {
        const { login, password } = this.state;
        e.preventDefault();
        this.props.onSubmit({ login, password });
    };

    inputValue = (event, valuePath) => this.setState({ [valuePath]: _.get(event, 'currentTarget.value', '') });

    render() {
        return (
            <div className={styles.loginContainer}>
                <div>
                    <h1>SQM</h1>
                    <form
                        onSubmit={this.onSubmit}
                    >

                            <TextField
                                id="sidhfuisudhf"
                                label={ls('LOGIN_LOGIN', 'Логин')}
                                name="login"
                                value={this.state.login}
                                onChange={event => this.inputValue(event, 'login')}
                            />
                            <TextField
                                id="dsrfgdfsg"
                                type="password"
                                name="password"
                                label={ls('LOGIN_PASSWD', 'Пароль')}
                                value={this.state.password}
                                onChange={event => this.inputValue(event, 'password')}
                            />

                        <button type="submit" color="primary">
                            {ls('LOGIN_SUBMIT', 'Вход')}
                        </button>
                    </form>
                </div>
            </div>);
    }
}

export default Login;
