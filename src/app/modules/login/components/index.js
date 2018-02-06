import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Form, FormGroup, Input } from 'reactstrap';
import _ from 'lodash';

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
                    <h1>SQ <Badge color="secondary">M</Badge></h1>
                    <Form
                        className={styles.loginForm}
                        onSubmit={this.onSubmit}
                    >
                        <FormGroup>
                            <Input
                                placeholder={ls('LOGIN_LOGIN', 'Логин')}
                                name="login"
                                required
                                className={styles.inputField}
                                value={this.state.login}
                                onChange={event => this.inputValue(event, 'login')}
                            />
                            <Input
                                type="password"
                                name="password"
                                required
                                placeholder={ls('LOGIN_PASSWD', 'Пароль')}
                                className={styles.inputField}
                                value={this.state.password}
                                onChange={event => this.inputValue(event, 'password')}
                            />
                        </FormGroup>
                        <Button type="submit" color="primary">
                            {ls('LOGIN_SUBMIT', 'Вход')}
                        </Button>
                    </Form>
                </div>
            </div>);
    }
}

export default Login;
