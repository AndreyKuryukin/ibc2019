import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'reactstrap';

import Input from '../../../components/Input';
import _ from 'lodash';
import ls from '../../../../i18n';
import styles from './login.scss';

class Login extends React.PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func,
        onInput: PropTypes.func,
        loading: PropTypes.bool,
        errors: PropTypes.array,
        loginFailed: PropTypes.bool
    };

    static defaultProps = {
        onSubmit: () => null,
        onInput: () => null,
        errors: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            language: 'ru',
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors !== this.state.errors) {
            this.setState({ errors: nextProps.errors })
        }
    }

    onSubmit = (e) => {
        const { login, password } = this.state;
        e.preventDefault();
        this.props.onSubmit(login, password);
    };

    inputValue = (event, valuePath) => {
        const errors = _.omit({ ...this.state.errors }, valuePath);
        this.setState({ [valuePath]: _.get(event, 'currentTarget.value'), errors }, () => {
            this.props.onInput();
        });
    };

    render() {
        const { errors } = this.state;
        return (
            <div className={styles.loginContainer}>
                <div className={styles.shield}/>
                <div className={styles.formContainer}>
                    <div className={styles.sqmLabel}/>
                    <Form
                        onSubmit={this.onSubmit}
                        className={styles.loginForm}
                    >
                        <Input
                            value={this.state.login}
                            placeholder={ls('LOGIN_LOGIN', 'Логин')}
                            onChange={event => this.inputValue(event, 'login')}
                            valid={_.isEmpty(errors.login)}
                        />

                        <Input
                            type="password"
                            id="password"
                            value={this.state.password}
                            placeholder={ls('LOGIN_PASSWD', 'Пароль')}
                            onChange={(event) => this.inputValue(event, 'password')}
                            valid={_.isEmpty(errors.password)}
                        />

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
