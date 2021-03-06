import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form, Tooltip } from 'reactstrap';
import Modal from '../../../../../components/Modal';
import Input from '../../../../../components/Input';
import styles from './styles.scss';
import RolesGrid from './RolesGrid';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import Radio from '../../../../../components/Radio';
import ls from 'i18n';
import Divisions from "./Divisions";
import DraggableWrapper from "../../../../../components/DraggableWrapper/index";

const bodyStyle = { padding: 0 };

class UserEditor extends React.Component {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        userId: PropTypes.string,
        user: PropTypes.object,
        active: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onMount: PropTypes.func,
        rolesList: PropTypes.array,
        groupsList: PropTypes.array,
        divisions: PropTypes.object,
        errors: PropTypes.object,
    };

    static defaultProps = {
        userId: '',
        rolesList: [],
        groupsList: [],
        divisions: null,
        errors: null,
        active: false,
        onMount: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            user: props.userId ? props.user : {
                ...props.user,
                division_id: props.divisions ? props.divisions.id : null,
            },
            errors: null,
            showTooltipFor: null,
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

        if (this.state.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }

        if (this.props.divisions !== nextProps.divisions) {
            this.setUserProperty('division_id', nextProps.divisions.id);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const isCheckedIdsChanged = this.state.checkedIds !== nextState.checkedIds;
        const isRolesListChanged = this.state.rolesList !== nextProps.rolesList;
        const isGroupsListChanged = this.state.groupsList !== nextProps.groupsList;
        return true; //isCheckedIdsChanged || isRolesListChanged || isGroupsListChanged;
    }

    getUserProperty = (key, defaultValue) => _.get(this.state.user, key, defaultValue);

    setUserProperty = (key, value) => {
        const user = {
            ...this.state.user,
            [key]: value,
        };

        let errors = null;
        if (key === 'password' || key === 'confirm') {
            errors = user.password === user.confirm ? _.omit(this.state.errors, ['password', 'confirm']) : this.state.errors;
        } else {
            errors = _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors;
        }

        this.setState({
            user,
            errors,
        });
    };

    onClose = () => {
        this.context.history.push('/users-and-roles/users');
        this.props.onClose();
    };

    roleIdsToRoles = (roleIds) => {
        return Array.isArray(roleIds) ? roleIds.map(id => _.find(this.props.rolesList, role => role.id === id)) : [];
    };

    groupIdsToGroups = (groupIds) => {
        return Array.isArray(groupIds) ? groupIds.map(id => _.find(this.props.groupsList, role => role.id === id)) : [];
    };

    onSubmit = () => {
        const user = { ...this.state.user };
        user.roles = this.roleIdsToRoles(user.roles);
        user.groups = this.groupIdsToGroups(user.groups);
        if (typeof this.props.onSubmit === 'function') {
            this.props.onSubmit(this.props.userId, user);
        }
    };


    onPasswordClick = (e) => {
        const isCapsLockOn = e.getModifierState('CapsLock');

        this.setState({
            showTooltipFor: isCapsLockOn ? e.target.id : null,
        });
    };

    onPasswordKeyDown = (e) => {
        if (e.keyCode === 20) {
            const isCapsLockOn = e.getModifierState('CapsLock');
            this.setState({
                showTooltipFor: isCapsLockOn ? e.target.id : null,
            });
        }
    };

    onPasswordBlur = () => {
        this.setState({ showTooltipFor: null });
    };

    render() {
        const {
            active,
            userId,
            rolesList,
            groupsList,
            divisions,
        } = this.props;
        const { errors, showTooltipFor } = this.state;

        return (
            <Modal
                itemId="users"
                isOpen={active}
                title={userId
                    ? ls('USER_EDIT_USER', 'Редактирование пользователя') + ' ' + _.get(this.props.user, 'login', '')
                    : ls('USER_ADD_USER', 'Создание пользователя')}
                onClose={this.onClose}
                onSubmit={this.onSubmit}
                className={styles.userEditor}
                submitTitle={userId ? ls('SAVE', 'Сохранить') : ls('CREATE', 'Создать')}
                cancelTitle={ls('CANCEL', 'Отмена')}
            >
                <div
                    className={styles.userEditorContent}
                >
                    <div className={styles.userEditorColumn}>
                        <Panel
                            title={ls('USER_AUTHENTICATION_MODE_PANEL_TITLE', 'Способ аутентификации')}
                        >
                            <Field
                                id="custom"
                                labelText={ls('USER_CUSTOM_MODE_FIELD_TITLE', 'Внутренний')}
                                labelAlign="right"
                                labelWidth="95%"
                                inputWidth="5%"
                                splitter=""
                            >
                                <Radio
                                    id="custom"
                                    itemId="users_custom_radio"
                                    type="radio"
                                    name="authentication-mode"
                                    checked={!this.getUserProperty('ldap_auth')}
                                    onChange={value => this.setUserProperty('ldap_auth', false)}
                                />
                            </Field>
                            <Field
                                id="ldap"
                                labelText={ls('USER_LDAP_MODE_FIELD_TITLE', 'LDAP')}
                                labelAlign="right"
                                labelWidth="95%"
                                inputWidth="5%"
                                splitter=""
                            >
                                <Radio
                                    id="ldap"
                                    itemId="users_ldap_radio"
                                    type="radio"
                                    name="authentication-mode"
                                    checked={this.getUserProperty('ldap_auth')}
                                    onChange={value => this.setUserProperty('ldap_auth', true)}
                                />
                            </Field>
                        </Panel>
                        <Panel
                            title={ls('USER_CREATION_PANEL_TITLE', 'Основная информация')}
                        >
                            <Form
                                className={styles.userForm}
                            >
                                <Field
                                    id="login"
                                    labelText={ls('USER_LOGIN_FIELD_TITLE', 'Логин')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                    required
                                >
                                    <Input
                                        id="login"
                                        itemId="users_login_field"
                                        name="login"
                                        value={this.getUserProperty('login', '')}
                                        onChange={value => this.setUserProperty('login', value)}
                                        placeholder={ls('USERS_LOGIN_FIELD_PLACEHOLDER', 'Логин')}
                                        valid={errors && _.isEmpty(errors.login)}
                                        errorMessage={_.get(errors, 'login.title')}
                                    />
                                </Field>
                                <Field
                                    id="password"
                                    labelText={ls('USER_PASSWORD_FIELD_TITLE', 'Пароль')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                    required={!userId}
                                >
                                    <Input
                                        id="password"
                                        itemId="users_password_field"
                                        name="password"
                                        type="password"
                                        value={this.getUserProperty('password', '')}
                                        onChange={value => this.setUserProperty('password', value)}
                                        onClick={this.onPasswordClick}
                                        onKeyDown={this.onPasswordKeyDown}
                                        onFocus={this.onPasswordFocus}
                                        onBlur={this.onPasswordBlur}
                                        valid={errors && _.isEmpty(errors.password)}
                                        errorMessage={_.get(errors, 'password.title')}
                                        placeholder={ls('USERS_PASSWORD_FIELD_PLACEHOLDER', 'Пароль')}
                                    />
                                    <Tooltip placement="right" isOpen={showTooltipFor === 'password'} target="password">
                                        {ls('CAPS_LOCK_IS_ON_TEXT', 'Включен Caps Lock!')}
                                    </Tooltip>
                                </Field>
                                <Field
                                    id="confirm"
                                    labelText={ls('USER_CONFIRM_FIELD_TITLE', 'Подтвердите пароль')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                    required={!userId}
                                >
                                    <Input
                                        id="confirm"
                                        itemId="users_confirm_field"
                                        name="confirm"
                                        type="password"
                                        value={this.getUserProperty('confirm', '')}
                                        onChange={value => this.setUserProperty('confirm', value)}
                                        onClick={this.onPasswordClick}
                                        onKeyDown={this.onPasswordKeyDown}
                                        onFocus={this.onPasswordFocus}
                                        onBlur={this.onPasswordBlur}
                                        valid={errors && _.isEmpty(errors.confirm)}
                                        errorMessage={_.get(errors, 'confirm.title')}
                                        placeholder={ls('USERS_CONFIRM_PASSWORD_FIELD_PLACEHOLDER', 'Пароль')}
                                    />
                                    <Tooltip placement="right" isOpen={showTooltipFor === 'confirm'} target="confirm">
                                        {ls('CAPS_LOCK_IS_ON_TEXT', 'Включен Caps Lock!')}
                                    </Tooltip>
                                </Field>
                                <Field
                                    id="email"
                                    labelText={ls('USER_EMAIL_FIELD_TITLE', 'E-mail')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                    required
                                >
                                    <Input
                                        id="email"
                                        itemId="users_email_field"
                                        name="email"
                                        value={this.getUserProperty('email', '')}
                                        onChange={value => this.setUserProperty('email', value)}
                                        valid={errors && _.isEmpty(errors.email)}
                                        errorMessage={_.get(errors, 'email.title')}
                                        placeholder={ls('USERS_EMAIL_FIELD_PLACEHOLDER', 'E-mail')}
                                    />
                                </Field>
                                <Field
                                    id="name"
                                    labelText={ls('USER_NAME_FIELD_TITLE', 'Имя')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                >
                                    <Input
                                        id="name"
                                        itemId="users_name_field"
                                        name="name"
                                        value={this.getUserProperty('first_name', '')}
                                        onChange={value => this.setUserProperty('first_name', value)}
                                        placeholder={ls('USERS_NAME_FIELD_PLACEHOLDER', 'Имя')}
                                    />
                                </Field>
                                <Field
                                    id="last-name"
                                    labelText={ls('USER_LAST_NAME_FIELD_TITLE', 'Фамилия')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                >
                                    <Input
                                        id="last-name"
                                        itemId="users_last_name_field"
                                        name="last-name"
                                        value={this.getUserProperty('last_name', '')}
                                        onChange={value => this.setUserProperty('last_name', value)}
                                        placeholder={ls('USERS_LAST_NAME_FIELD_PLACEHOLDER', 'Фамилия')}
                                    />
                                </Field>
                                <Field
                                    id="phone"
                                    labelText={ls('USER_PHONE_FIELD_TITLE', 'Телефон')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                >
                                    <Input
                                        id="phone"
                                        itemId="users_phone_field"
                                        type="number"
                                        name="phone"
                                        value={this.getUserProperty('phone', '')}
                                        onChange={value => this.setUserProperty('phone', value)}
                                        maxLength={11}
                                        placeholder={ls('USERS_PHONE_FIELD_PLACEHOLDER', 'Телефон')}
                                    />
                                </Field>
                            </Form>
                        </Panel>
                    </div>
                    <div className={styles.userEditorColumn}>
                        <Panel
                            title={ls('USER_ROLE_PANEL_TITLE', 'Роль')}
                            bodyStyle={bodyStyle}
                        >
                            <RolesGrid
                                id="user-editor-roles-grid"
                                itemId="users_roles"
                                data={rolesList}
                                checked={this.getUserProperty('roles', [])}
                                onCheck={checked => this.setUserProperty('roles', checked)}
                            />
                        </Panel>
                    </div>
                    <div className={styles.userEditorColumn}>
                        <Divisions
                            data={divisions ? [divisions] : []}
                            division={this.getUserProperty('division_id')}
                            onCheck={id => this.setUserProperty('division_id', id)}
                        />
                    </div>
                    <div className={styles.userEditorColumn}>
                        <Panel
                            title={ls('USER_NOTIFICATION_GROUP_PANEL_TITLE', 'Группы уведомлений')}
                            bodyStyle={bodyStyle}
                        >
                            <RolesGrid
                                data={groupsList}
                                itemId="users_groups"
                                id="edit-user-groups"
                                checked={this.getUserProperty('groups', [])}
                                onCheck={checked => this.setUserProperty('groups', checked)}
                            />
                        </Panel>
                    </div>
                </div>
            </Modal>
        );
    }
}


export default UserEditor;
