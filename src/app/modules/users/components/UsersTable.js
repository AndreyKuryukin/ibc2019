import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import { createSelector } from 'reselect';
import memoize from 'memoizejs';
import Table from '../../../components/Table';
import { CheckedCell, DefaultCell, IconCell } from '../../../components/Table/Cells';
import MailLink from "../../../components/MailLink/index";
import search from '../../../util/search';
import { convertUTC0ToLocal } from '../../../util/date';

class UsersTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array,
        divisionsById: PropTypes.object,
        searchText: PropTypes.string,
        onCheck: PropTypes.func,
        preloader: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        checked: [],
        divisionsById: {},
        searchText: '',
        onCheck: () => null,
        preloader: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    static mapUsersFromProps = createSelector(
        props => props.data,
        props => props.divisionsById,
        (users, divisionsById) => users.map(user => ({
            id: user.id,
            login: user.login,
            name: `${user.last_name} ${user.first_name}`,
            email: user.email,
            phone: user.phone,
            roles: user.roles.map(role => role.name).join(', '),
            division: _.get(divisionsById, `${user.division_id}.name`, ''),
            groups: user.groups.map(group => group.name).join(', '),
            created: convertUTC0ToLocal(user.created).format('YYYY-MM-DD HH:mm:ss'),
            last_connection: user.last_connection ? convertUTC0ToLocal(user.last_connection).format('YYYY-MM-DD HH:mm:ss') : '',
            disabled: user.disabled ? ls('NO', 'Нет') : ls('YES', 'Да'),
        })),
    );

    static getColumns = memoize(() => [{
        name: 'checked',
        width: 28,
    }, {
        title: ls('USERS_TABLE_LOGIN_COLUMN_TITLE', 'Логин'),
        name: 'login',
        searchable: true,
        sortable: true,
        width: 110,
    }, {
        title: ls('USERS_TABLE_NAME_COLUMN_TITLE', 'Имя'),
        name: 'name',
        searchable: true,
        sortable: true,
        width: 140,
    }, {
        title: ls('USERS_TABLE_EMAIL_COLUMN_TITLE', 'E-mail'),
        name: 'email',
        searchable: true,
        sortable: true,
        width: 120,
    }, {
        title: ls('USERS_TABLE_CELL_PHONE_COLUMN_TITLE', 'Телефон'),
        name: 'phone',
        searchable: true,
        sortable: true,
        width: 110,
    }, {
        title: ls('USERS_TABLE_ROLES_COLUMN_TITLE', 'Роли'),
        name: 'roles',
        searchable: true,
        sortable: true,
        width: 110,
    }, {
        title: ls('USERS_TABLE_DIVISIONS_COLUMN_TITLE', 'Подразделение'),
        name: 'division',
        searchable: true,
        sortable: true,
        width: 110,
    }, {
        title: ls('USERS_TABLE_NOTIFICATION_GROUP_COLUMN_TITLE', 'Группы'),
        name: 'groups',
        searchable: true,
        sortable: true,
        width: 170,
    }, {
        title: ls('USERS_TABLE_CREATED_COLUMN_TITLE', 'Создан'),
        name: 'created',
        searchable: true,
        sortable: true,
        width: 130,
    }, {
        title: ls('USERS_TABLE_LAST_CONNECTION_COLUMN_TITLE', 'Последний вход'),
        name: 'last_connection',
        searchable: true,
        sortable: true,
        width: 130,
    }, {
        title: ls('USERS_TABLE_ACTIVE_COLUMN_TITLE', 'Активен'),
        name: 'disabled',
        searchable: true,
        sortable: true,
        width: 70
    }]);

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.props.checked, node.id] : _.without(this.props.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });

        this.props.onCheck(checked);
    };

    headerRowRender = (column, sort) => {
        switch (column.name) {
            case 'checked': {
                const checkedPartially = this.props.data.length !== 0 && this.props.checked.length > 0 && this.props.checked.length < this.props.data.length;
                const isAllChecked = !checkedPartially && this.props.data.length !== 0 && this.props.checked.length === this.props.data.length;
                return (
                    <CheckedCell
                        id="users-all"
                        onChange={this.onCheck}
                        style={{ marginLeft: 0 }}
                        value={isAllChecked}
                        checkedPartially={checkedPartially}
                    />
                );
            }
            default:
                return (
                    <DefaultCell
                        content={column.title}
                        sortDirection={sort.by === column.name ? sort.direction : null}
                    />
                );
        }
    };

    bodyRowRender = (column, node) => {
        const value =  node[column.name] || '';
        switch (column.name) {
            case 'checked': {
                const isRowChecked = this.props.checked.includes(node.id);
                return (
                    <CheckedCell
                        id={`users-user-${node.id}`}
                        onChange={(value) => this.onCheck(value, node)}
                        style={{ marginLeft: 0 }}
                        value={isRowChecked}
                    />
                );
            }
            case 'email' : {
                return (
                    <DefaultCell
                        content={
                            <MailLink href={value}>{value}</MailLink>
                        }
                    />
                );
            }
            case 'login':
                return (
                    <IconCell
                        icon="adminIcon"
                        href={`/users-and-roles/users/edit/${node.id}`}
                        text={value}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={value}
                    />
                );
        }
    };

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    render() {
        const { searchText } = this.props;
        const data = UsersTable.mapUsersFromProps(this.props);
        const columns = UsersTable.getColumns();
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <Table data={filteredData}
                   columns={columns}
                   headerRowRender={this.headerRowRender}
                   bodyRowRender={this.bodyRowRender}
                   preloader={this.props.preloader}
            />
        );
    }
}

export default UsersTable;