import React from 'react';
import { Badge, Button, Form, FormGroup, Input } from 'reactstrap';
import _ from 'lodash';

import ls from 'i18n';
import styles from './login.scss';

class Login extends React.PureComponent {

    onSubmit = (e) => {
        e.preventDefault();

    };

    inputValue = (event, valuePath) => this.setState({[valuePath]: _.get(event, 'currentTarget.value', '')});

    render() {
        return <div className={styles.loginContainer}>
            <div className={styles.loginPanel}>
                <h1>Smart <Badge color="secondary">TUBE</Badge></h1>
                <Form
                    className={styles.loginForm}
                    onSubmit={this.onSubmit}
                >
                    <FormGroup>
                        <Input
                            placeholder={ls('LOGIN_LOGIN', 'Логин')}
                            name="login"
                            className={styles.inputField}
                            onChange={(event) => this.inputValue(event, 'login')}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder={ls('LOGIN_PASSWD', 'Пароль')}
                            className={styles.inputField}
                            onChange={(event) => this.inputValue(event, 'password')}
                        />
                    </FormGroup>
                    <Button type="submit" color="primary">
                        {ls('LOGIN_SUBMIT', 'Вход')}
                    </Button>
                </Form>
            </div>
        </div>;
    }
}

export default Login;