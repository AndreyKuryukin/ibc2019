import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Form} from 'reactstrap';

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

    getErrors = (loginFailed) => {
        if (loginFailed) {
            return [{
                type: 'VALIDATION',
                severity: 'CRITICAL',
                target: 'login',
            },{
                type: 'VALIDATION',
                severity: 'CRITICAL',
                target: 'password',
            }]
        }
        return [];
    };

    render() {
        const {loginFailed} = this.props;
        return (
            <div className={styles.loginContainer}>
                <div className={styles.shield}/>
                <div className={styles.formContainer}>
                    <div className={styles.sqmLabel}/>
                    <Form
                        onSubmit={this.onSubmit}
                        className={styles.loginForm}
                    >
                        <ErrorWrapper
                            errors={this.getErrors(loginFailed)}
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

                        </ErrorWrapper>
                        <Button
                            type="submit"
                            color="action"
                        >
                            {ls('LOGIN_SUBMIT', 'ВХОД')}
                        </Button>
                    </Form>
                </div>
            </div>);
    }
}

export default Login;
