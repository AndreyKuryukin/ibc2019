import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';
import ls from 'i18n';
import TabPanel from '../../../components/TabPanel';
import UserEditor from '../modules/UserEditor/containers';
import UsersTable from './UsersTable';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/index';

class Users extends React.Component {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
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

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

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
        this.props.history.push('/users/add');
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
        const { match, history } = this.props;
        const { searchText } = this.state;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const userId = params.id ? String(params.id) : null;

        return (
            <TabPanel onTabClick={(tabId) => history && history.push(`${tabId}`)}
                      activeTabId="/users"
                      className={styles.usersContainer}>
                <div className={styles.usersWrapper}
                     id="/users"
                     tabTitle={ls('USERS_TAB_TITLE', 'Пользователи')}>

                    <div className={styles.controlsWrapper}>
                        <Icon icon="addIcon" onClick={this.onAdd} />
                        <Icon icon="deleteIcon" onClick={this.onDelete} style={{ marginLeft: 10 }} />
                        <Icon icon="lockIcon" onClick={this.onLock} style={{ marginLeft: 10 }} />
                        <Icon icon="unlockIcon" onClick={this.onUnlock}/>
                        <Icon icon="groupIcon"  style={{ marginLeft: 20 }} />
                        <Input placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
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

                    {isEditorActive && <UserEditor
                        active={isEditorActive}
                        userId={userId}
                    />}
                </div>
                <div id="/roles" tabTitle={ls('ROLES_TAB_TITLE', 'Роли')} />
            </TabPanel>
        );
    }
}

export default Users;
