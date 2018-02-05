import React from 'react';
import { Form, FormGroup, Input, Badge, Button  } from 'reactstrap';
import ls from 'i18n';

import styles from './login.scss';

class Login extends React.PureComponent {
    render() {
        return <div className={styles.loginContainer}>
            <div className={styles.loginPanel}>
                <h1>Smart <Badge color="secondary">TUBE</Badge></h1>
                <Form className={styles.loginForm}>
                    <FormGroup>
                        <Input
                            placeholder={ls('LOGIN_LOGIN', 'Логин')}
                            name="login"
                            className={styles.inputField}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder={ls('LOGIN_PASSWD', 'Пароль')}
                            className={styles.inputField}
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