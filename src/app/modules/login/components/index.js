import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'reactstrap';

import Preloader from '../../../components/Preloader';
import Input from '../../../components/Input';
import _ from 'lodash';
import ls from '../../../../i18n';
import styles from './login.scss';
import Select from "../../../components/Select/index";
import { LANGUAGES, LANGUAGE_OPTIONS, PLACEHOLDERS } from '../../../costants/login';

class Login extends React.PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func,
        onInput: PropTypes.func,
        loading: PropTypes.bool,
        errors: PropTypes.object,
        loginFailed: PropTypes.bool,
        language: PropTypes.string,
        onLanguageChange: PropTypes.func,
    };

    static defaultProps = {
        onSubmit: () => null,
        onInput: () => null,
        errors: {},
        language: LANGUAGES.RUSSIAN,
        onLanguageChange: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors !== this.state.errors) {
            this.setState({ errors: nextProps.errors })
        }
    }

    onSubmit = (e) => {
        const { login, password } = this.state;
        const { language } = this.props;
        e.preventDefault();
        this.props.onSubmit(login, password, language);
    };

    inputValue = (value, valuePath) => {
        const errors = _.omit({ ...this.state.errors }, valuePath);
        if (valuePath === 'language') {
            this.props.onLanguageChange(value);
        } else {
            this.setState({ [valuePath]: value, errors }, () => {
                this.props.onInput();
            });
        }
    };

    render() {
        const { errors } = this.state;
        const { language } = this.props;
        return (
            <div className={styles.loginContainer}>
                <div className={styles.shield}>
                    <div className={styles.rostelecomLogo}></div>
                </div>
                <div className={styles.formContainer}>
                    <div className={styles.sqmLabel}>
                        {'SQM B2C'}
                    </div>
                    <Preloader
                        active={this.props.loading}
                        text={ls('PRELOADER_DEFAULT_TEXT', language === LANGUAGES.RUSSIAN ? 'Загрузка' : 'Loading')}
                    >
                        <Form
                            onSubmit={this.onSubmit}
                            className={styles.loginForm}
                        >
                            <Input
                                value={this.state.login}
                                placeholder={_.get(PLACEHOLDERS, `${language}.LOGIN`, 'Логин')}
                                onChange={value => this.inputValue(value, 'login')}
                                valid={_.isEmpty(errors.login)}
                            />

                            <Input
                                type="password"
                                id="password"
                                value={this.state.password}
                                placeholder={_.get(PLACEHOLDERS, `${language}.PASSWORD`, 'Пароль')}
                                onChange={value => this.inputValue(value, 'password')}
                                valid={_.isEmpty(errors.password)}
                            />
                            <Select
                                options={LANGUAGE_OPTIONS}
                                onChange={value => this.inputValue(value, 'language')}
                                value={language}
                            />

                            <Button
                                type="submit"
                                color="action"
                            >
                                {_.get(PLACEHOLDERS, `${language}.LOG_IN`, 'ВХОД')}
                            </Button>
                        </Form>
                    </Preloader>
                </div>
            </div>);
    }
}

export default Login;
