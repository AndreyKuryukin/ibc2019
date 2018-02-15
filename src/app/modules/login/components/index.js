import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Field, Select, TextInput } from 'qreact';
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
            language: 'ru'
        }
    }

    onSubmit = (e) => {
        const { login, password } = this.state;
        e.preventDefault();
        this.props.onSubmit({ login, password });
    };

    inputValue = (event, valuePath) => this.setState({ [valuePath]: _.get(event, 'currentTarget.value', '') });

    getLanguageOptions = () => {
        return [{
            value: 'ru',
            text: ls('RUSSIAN_LANGUAGE', 'Русский')
        }, {
            value: 'en',
            text: ls('ENGLISH_LANGUAGE', 'English')
        }]
    }

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
                            id={'login'}
                            label={ls('LOGIN_LOGIN', 'Логин')}
                            labelWidth={100}
                            className={styles.field}
                        >
                            <TextInput
                                name="login"
                                value={this.state.login}
                                onChange={event => this.inputValue(event, 'login')}
                            />
                        </Field>
                        <Field
                            id="password"
                            label={ls('LOGIN_PASSWD', 'Пароль')}
                            labelWidth={100}
                            className={styles.field}
                        >
                            <TextInput
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={event => this.inputValue(event, 'password')}
                            />
                        </Field>

                        <Select
                            options={this.getLanguageOptions()}
                            classname={styles.fieldInput}
                            width={100}
                            onChange={value => this.setState({language: value})}
                            value={this.state.language}
                            style={{marginTop: 4, marginLeft: 47}}
                        />

                        <Button
                            type="submit"
                            color="primary"
                            text={ls('LOGIN_SUBMIT', 'Вход')}
                        />
                    </form>
                </div>
            </div>);
    }
}

export default Login;
