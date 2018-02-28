import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'reactstrap';
import Modal from '../../../../../components/Modal';
import ErrorWrapper from "../../../../../components/Errors/ErrorWrapper";
import Input from '../../../../../components/Input';
import styles from './styles.scss';
import RolesTable from './RolesTable';

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
    }

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
                        <Input
                            name="login"
                            value={this.getUserProperty('login', '')}
                            placeholder={'Логин'}
                            onChange={event => this.setUserProperty('login', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="password"
                            type="password"
                            value={this.getUserProperty('password', '')}
                            placeholder={'Пароль'}
                            onChange={event => this.setUserProperty('password', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="confirm"
                            type="password"
                            value={this.getUserProperty('confirm', '')}
                            placeholder={'Подтвердите пароль'}
                            onChange={event => this.setUserProperty('confirm', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="name"
                            value={this.getUserProperty('first_name', '')}
                            placeholder={'Имя'}
                            onChange={event => this.setUserProperty('first_name', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="last-name"
                            value={this.getUserProperty('last_name', '')}
                            placeholder={'Фамилия'}
                            onChange={event => this.setUserProperty('last_name', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="email"
                            value={this.getUserProperty('email', '')}
                            placeholder={'E-mail'}
                            onChange={event => this.setUserProperty('email', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="phone"
                            value={this.getUserProperty('phone', '')}
                            placeholder={'Телефон'}
                            onChange={event => this.setUserProperty('phone', _.get(event, 'target.value'))}
                        />
                        <Input
                            name="admin"
                            type="checkbox"
                            onChange={event => this.setUserProperty('admin', _.get(event, 'target.checked'))}
                            checked={this.getUserProperty('admin', '')}
                        />
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
