import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Field, TextInput } from 'qreact';
import ls from '../../../../i18n';
import styles from './login.scss';

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
                <div className={styles.loginPanel}>
                    <h1>SQM</h1>
                    <form
                        onSubmit={this.onSubmit}
                        className={styles.loginForm}
                    >

                        <Field
                            label={ls('LOGIN_LOGIN', 'Логин')}
                            labelWidth={100}
                            className={styles.field}
                        >
                            <TextInput
                                id="login"
                                name="login"
                                value={this.state.login}
                                onChange={event => this.inputValue(event, 'login')}
                            />
                        </Field>
                        <Field
                            label={ls('LOGIN_LOGIN', 'Логин')}
                            labelWidth={100}
                            className={styles.field}
                        >
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                label={ls('LOGIN_PASSWD', 'Пароль')}
                                value={this.state.password}
                                onChange={event => this.inputValue(event, 'password')}
                            />
                        </Field>
                        <Field
                            labelWidth={100}
                            className={styles.field}
                        >
                            <Button
                                type="submit"
                                color="primary"
                                text={ls('LOGIN_SUBMIT', 'Вход')}
                            />
                        </Field>
                    </form>
                </div>
            </div>);
    }
}

export default Login;
