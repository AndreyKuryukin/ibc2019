import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';
import ls from 'i18n';
import TabPanel from '../../../components/TabPanel';
import UserEditor from '../modules/UserEditor/containers';
import UsersTable from './UsersTable';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/index';

const iconStyle = { marginRight: 10 };
const groupIconStyle = { marginLeft: 20 };

class Users extends React.Component {
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        usersData: PropTypes.array,
        divisionsById: PropTypes.object,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
        onDelete: PropTypes.func,
        onLock: PropTypes.func,
        onUnlock: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        divisionsById: null,
        isLoading: false,
        onMount: () => null,
        onDelete: () => null,
        onUnlock: () => null,
        onLock: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            checkedIds: [],
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onCheck = (checkedIds) => {
        this.setState({ checkedIds });
    };

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    onAdd = () => {
        this.props.history.push('/users-and-roles/users/add');
    };

    onDelete = () => {
        const ids = this.state.checkedIds;
        const onSuccess = () => {
            this.setState({ checkedIds: [], });
        };
        if (ids.length > 0) {
            this.props.onDelete(ids, onSuccess);
        }
    };

    onLock = () => {
        const ids = this.state.checkedIds;
        if (ids.length > 0) {
            this.props.onLock(ids);
        }
    };

    onUnlock = () => {
        const ids = this.state.checkedIds;
        if (ids.length > 0) {
            this.props.onUnlock(ids);
        }
    };

    render() {
        const { match } = this.props;
        const { searchText } = this.state;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const userId = params.id ? String(params.id) : null;

        return (
            <div className={styles.usersWrapper}>
                <div className={styles.controlsWrapper}>
                    {this.context.hasAccess('USERS', 'EDIT') && <Fragment>
                        <Icon
                            icon="addIcon"
                            onClick={this.onAdd}
                            style={iconStyle}
                            title={ls('ADD_USER_TITLE', 'Добавить пользователя')}
                        />
                        <Icon
                            icon="deleteIcon"
                            onClick={this.onDelete}
                            style={iconStyle}
                            title={ls('DELETE_USER_TITLE', 'Удалить пользователя')}
                        />
                    </Fragment>}
                    <Icon
                        icon="lockIcon"
                        onClick={this.onLock}
                        title={ls('LOCK_USER_TITLE', 'Заблокировать пользователя')}
                    />
                    <Icon
                        icon="unlockIcon"
                        onClick={this.onUnlock}
                        title={ls('UNLOCK_USER_TITLE', 'Разблокировать пользователя')}
                    />
                    <Icon
                        icon="groupIcon"
                        style={groupIconStyle}
                        title={ls('CREATE_USER_GROUP_TITLE', 'Создать группу пользователей')}
                    />
                    <Input
                        placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                        className={styles.search}
                        onChange={e => this.onSearchTextChange(_.get(e, 'currentTarget.value', ''))}
                    />
                </div>

                <UsersTable
                    data={this.props.usersData}
                    divisionsById={this.props.divisionsById}
                    searchText={searchText}
                    checked={this.state.checkedIds}
                    onCheck={this.onCheck}
                    preloader={this.props.isLoading}
                />

                {this.context.hasAccess('USERS', 'EDIT') && isEditorActive && <UserEditor
                    active={isEditorActive}
                    userId={userId}
                />}
            </div>
        );
    }
}

export default Users;
