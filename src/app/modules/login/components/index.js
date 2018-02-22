import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Form, FormFeedback, FormGroup, Alert } from 'reactstrap';

import Input from '../../../components/Input';
import _ from 'lodash';
import ls from '../../../../i18n';
import styles from './login.scss';
import ErrorWrapper from "../../../components/Errors/ErrorWrapper";

class Login extends React.PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func,
        loading: PropTypes.bool,
        errors: PropTypes.array,
        loginFailed: PropTypes.bool
    };

    static defaultProps = {
        onSubmit: () => null,
        errors: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            language: 'ru',
        };
    }

    onSubmit = (e) => {
        const { login, password } = this.state;
        e.preventDefault();
        this.props.onSubmit(login, password);
    };

    inputValue = (event, valuePath) => this.setState({ [valuePath]: _.get(event, 'currentTarget.value') });

    getLanguageOptions = () => [{
        value: 'ru',
        text: ls('RUSSIAN_LANGUAGE', 'Русский'),
    }, {
        value: 'en',
        text: ls('ENGLISH_LANGUAGE', 'English'),
    }];

    render() {
        const {loginFailed} = this.props;
        return (
            <div className={styles.loginContainer}>
                <div>
                    <h1><Badge color="primary">SQM</Badge></h1>
                    <Form
                        onSubmit={this.onSubmit}
                        className={styles.loginForm}
                    >
                        {loginFailed && <Alert color="danger" className={styles.errorMessage}>
                            {ls('LOGIN_FAILED_MESSAGE', 'Неверные данные')}
                        </Alert>}
                        <ErrorWrapper
                            errors={this.props.errors}
                            className={styles.errorGroup}
                        >
                            <Input
                                name="login"
                                required
                                value={this.state.login}
                                placeholder={ls('LOGIN_LOGIN', 'Логин')}
                                onChange={event => this.inputValue(event, 'login')}
                            />

                            <Input
                                type="password"
                                name="password"
                                id="password"
                                required
                                value={this.state.password}
                                placeholder={ls('LOGIN_PASSWD', 'Пароль')}
                                onChange={(event) => this.inputValue(event, 'password')}
                            />

                            <Input
                                type="select"
                                name="language"
                                value={this.state.language}
                                onChange={(event) => this.inputValue(event, 'language')}
                                id="language"
                            >
                                {this.getLanguageOptions().map(opt => <option key={`opt-${opt.value}`}
                                                                              value={opt.value}>{opt.text}</option>)}
                            </Input>
                        </ErrorWrapper>
                        <Button
                            type="submit"
                            color="primary"
                        >
                            {ls('LOGIN_SUBMIT', 'Вход')}
                        </Button>
                    </Form>
                </div>
            </div>);
    }
}

export default Login;
