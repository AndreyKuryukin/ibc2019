import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'reactstrap';
import Modal from '../../../../../components/Modal';
import Input from '../../../../../components/Input';
import styles from './styles.scss';
import RolesTable from './RolesTable';
import Field from "../../../../../components/Field/index";
import ls from "i18n";

class UserEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        userId: PropTypes.number,
        user: PropTypes.object,
        active: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
        onMount: PropTypes.func,
        rolesList: PropTypes.array,
    };

    static defaultProps = {
        rolesList: [],
        active: false,
        onMount: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            user: {},
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user !== nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }
    }

    getUserProperty = (key, defaultValue) => _.get(this.state.user, key, defaultValue);

    setUserProperty = (key, value) => {
        const user = {
            ...this.state.user,
            [key]: value,
        };

        this.setState({
            user,
        });
    }

    onClose = () => {
        this.context.history.push('/users');
    }

    onSubmit = () => {
        const user = _.omit(this.state.user, 'confirm');
        if (typeof this.props.onSubmit === 'function') {
            this.props.onSubmit(this.props.userId, this.state.user);
        }
    };

    render() {
        const {
            active,
            userId,
            rolesList,
            user
        } = this.props;
        return (
            <Modal
                isOpen={active}
                title={userId ? "Редактирование пользователя" : "Создание пользователя"}
                onClose={this.onClose}
                onSubmit={this.onSubmit}
                size="lg"
            >
                <div
                    className={styles.roleEditorContent}
                >
                    <Form
                        className={styles.userForm}
                    >
                        <Field labelText={ls('USER_LOGIN_FIELD_TITLE', 'Логин')}
                               required>
                            <Input
                                name="login"
                                value={this.getUserProperty('login', '')}
                                onChange={event => this.setUserProperty('login', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_PASSWORD_FIELD_TITLE', 'Пароль')}
                               required>
                            <Input
                                name="password"
                                type="password"
                                value={this.getUserProperty('password', '')}
                                onChange={event => this.setUserProperty('password', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_CONFIRM_FIELD_TITLE', 'Подтвердите пароль')}
                               required>
                            <Input
                                name="confirm"
                                type="password"
                                value={this.getUserProperty('confirm', '')}
                                onChange={event => this.setUserProperty('confirm', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_NAME_FIELD_TITLE', 'Имя')}
                        >
                            <Input
                                name="name"
                                value={this.getUserProperty('first_name', '')}
                                onChange={event => this.setUserProperty('first_name', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_LAST_NAME_FIELD_TITLE', 'Фамилия')}
                        >
                            <Input
                                name="last-name"
                                value={this.getUserProperty('last_name', '')}
                                onChange={event => this.setUserProperty('last_name', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_EMAIL_FIELD_TITLE', 'E-mail')}>
                            <Input
                                name="email"
                                value={this.getUserProperty('email', '')}
                                onChange={event => this.setUserProperty('email', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_PHONE_FIELD_TITLE', 'Телефон')}>
                            <Input
                                name="phone"
                                value={this.getUserProperty('phone', '')}
                                onChange={event => this.setUserProperty('phone', _.get(event, 'target.value'))}
                            />
                        </Field>
                        <Field labelText={ls('USER_ADMIN_FIELD_TITLE', 'Администратор')}
                               labelAlign="right"
                               inputWidth={23}
                        >
                            <Input
                                name="admin"
                                type="checkbox"
                                onChange={event => this.setUserProperty('admin', _.get(event, 'target.checked'))}
                                checked={this.getUserProperty('admin', '')}
                            />
                        </Field>
                    </Form>
                    <div className={styles.userRoles}>
                        <RolesTable
                            data={rolesList}
                            user={user}
                            onCheck={checked => this.setUserProperty('roles', checked)}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}


export default UserEditor;
