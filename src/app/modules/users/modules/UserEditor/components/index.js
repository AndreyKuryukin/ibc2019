import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'reactstrap';
import Modal from '../../../../../components/Modal';
import Input from '../../../../../components/Input';
import styles from './styles.scss';
import RolesGrid from './RolesGrid';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import Radio from '../../../../../components/Radio';
import ls from 'i18n';
import Divisions from "./Divisions";

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

    shouldComponentUpdate(nextProps, nextState) {
        const isCheckedIdsChanged = this.state.checkedIds !== nextState.checkedIds;

        return !isCheckedIdsChanged;
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
                title={userId ? ls('USER_EDIT_USER', 'Редактирование пользователя') : ls('USER_ADD_USER', 'Создание пользователя')}
                onClose={this.onClose}
                onSubmit={this.onSubmit}
                className={styles.userEditor}
                modalClassName={styles.userEditor}
            >
                <div
                    className={styles.userEditorContent}
                >
                    <div className={styles.userEditorColumn}>
                        <Panel
                            title={ls('USER_AUTHENTICATION_MODE_PANEL_TITLE', 'Authentication mode')}
                        >
                            <Field
                                id="ldap"
                                labelText={ls('USER_LDAP_MODE_FIELD_TITLE', 'LDAP')}
                                labelAlign="right"
                                labelWidth="95%"
                                inputWidth="5%"
                            >
                                <Radio
                                    id="ldap"
                                    type="radio"
                                    name="authentication-mode"
                                    checked={this.getUserProperty('authenticationMode', '') === 'ldap'}
                                    onChange={value => this.setUserProperty('authenticationMode', value)}
                                />
                            </Field>
                            <Field
                                id="custom"
                                labelText={ls('USER_CUSTOM_MODE_FIELD_TITLE', 'Custom')}
                                labelAlign="right"
                                labelWidth="95%"
                                inputWidth="5%"
                            >
                                <Radio
                                    id="custom"
                                    type="radio"
                                    name="authentication-mode"
                                    checked={this.getUserProperty('authenticationMode', '') === 'custom'}
                                    onChange={value => this.setUserProperty('authenticationMode', value)}
                                />
                            </Field>
                        </Panel>
                        <Panel
                            title={ls('USER_CREATION_PANEL_TITLE', 'User creation')}
                        >
                            <Form
                                className={styles.userForm}
                            >
                                <Field
                                    id="login"
                                    labelText={ls('USER_LOGIN_FIELD_TITLE', 'Логин')}
                                    required
                                >
                                    <Input
                                        id="login"
                                        name="login"
                                        value={this.getUserProperty('login', '')}
                                        onChange={event => this.setUserProperty('login', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="password"
                                    labelText={ls('USER_PASSWORD_FIELD_TITLE', 'Пароль')}
                                    required
                                >
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={this.getUserProperty('password', '')}
                                        onChange={event => this.setUserProperty('password', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="confirm"
                                    labelText={ls('USER_CONFIRM_FIELD_TITLE', 'Подтвердите пароль')}
                                    required
                                >
                                    <Input
                                        id="confirm"
                                        name="confirm"
                                        type="password"
                                        value={this.getUserProperty('confirm', '')}
                                        onChange={event => this.setUserProperty('confirm', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="name"
                                    labelText={ls('USER_NAME_FIELD_TITLE', 'Имя')}
                                >
                                    <Input
                                        id="name"
                                        name="name"
                                        value={this.getUserProperty('first_name', '')}
                                        onChange={event => this.setUserProperty('first_name', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="last-name"
                                    labelText={ls('USER_LAST_NAME_FIELD_TITLE', 'Фамилия')}
                                >
                                    <Input
                                        id="last-name"
                                        name="last-name"
                                        value={this.getUserProperty('last_name', '')}
                                        onChange={event => this.setUserProperty('last_name', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="email"
                                    labelText={ls('USER_EMAIL_FIELD_TITLE', 'E-mail')}
                                >
                                    <Input
                                        id="email"
                                        name="email"
                                        value={this.getUserProperty('email', '')}
                                        onChange={event => this.setUserProperty('email', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="phone"
                                    labelText={ls('USER_PHONE_FIELD_TITLE', 'Телефон')}
                                >
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={this.getUserProperty('phone', '')}
                                        onChange={event => this.setUserProperty('phone', _.get(event, 'target.value'))}
                                    />
                                </Field>
                            </Form>
                        </Panel>
                    </div>
                    <div className={styles.userEditorColumn}>
                        <Panel
                            title={ls('USER_ROLE_PANEL_TITLE', 'Role')}
                            bodyStyle={{ padding: 0 }}
                        >
                            <RolesGrid
                                data={rolesList}
                                user={user}
                                onCheck={checked => this.setUserProperty('roles', checked)}
                            />
                        </Panel>
                    </div>
                    <div className={styles.userEditorColumn}>
                        <Divisions
                            data={rolesList}
                            checked={[]}
                            onCheck={checked => this.setUserProperty('division', checked)}
                        />
                    </div>
                    <div className={styles.userEditorColumn}>
                        <Panel
                            title={ls('USER_NOTIFICATION_GROUP_PANEL_TITLE', 'Notification group')}
                            bodyStyle={{ padding: 0 }}
                        >
                            <RolesGrid
                                data={[]}
                                user={user}
                            />
                        </Panel>
                    </div>
                </div>
            </Modal>
        );
    }
}


export default UserEditor;
