import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Table from '../../../components/Table';
import { CheckedCell, DefaultCell, IconCell } from '../../../components/Table/Cells';
import MailLink from "../../../components/MailLink/index";
import search from '../../../util/search';

class UsersTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        onCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: [],
            searchText: '',
        };
    }

    getColumns = () => [{
        name: 'checked',
        width: 28,
    }, {
        title: ls('USERS_TABLE_LOGIN_COLUMN_TITLE', 'Логин'),
        name: 'login',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_NAME_COLUMN_TITLE', 'Имя'),
        name: 'name',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_EMAIL_COLUMN_TITLE', 'Email'),
        name: 'email',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_CELL_PHONE_COLUMN_TITLE', 'Телефон'),
        name: 'phone',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_ROLES_COLUMN_TITLE', 'Роли'),
        name: 'roles',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_DIVISIONS_COLUMN_TITLE', 'Подразделения'),
        name: 'divisions',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_NOTIFICATION_GROUP_COLUMN_TITLE', 'Группы'),
        name: 'notification_group',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_CREATED_COLUMN_TITLE', 'Создан'),
        name: 'created',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_LAST_CONNECTION_COLUMN_TITLE', 'Последний вход'),
        name: 'last_connection',
        searchable: true,
        sortable: true,
    }, {
        title: ls('USERS_TABLE_ACTIVE_COLUMN_TITLE', 'Активен'),
        name: 'active',
    }];

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });

        this.props.onCheck(checked);
    };

    headerRowRender = (column) => {
        switch (column.name) {
            case 'checked': {
                const checkedPartially = this.props.data.length !== 0 && this.state.checked.length > 0 && this.state.checked.length < this.props.data.length;
                const isAllChecked = !checkedPartially && this.props.data.length !== 0 && this.state.checked.length === this.props.data.length;
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
                    />
                );
        }
    };

    bodyRowRender = (column, node) => {
        const text = node[column.name];
        switch (column.name) {
            case 'checked': {
                const isRowChecked = this.state.checked.includes(node.id);
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
                return <MailLink href={node.email}>{node.email}</MailLink>
            }
            case 'login':
                return (
                    <IconCell
                        icon="adminIcon"
                        href={`/users/edit/${node.id}`}
                        text={text}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={text}
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
        const { data, searchText } = this.props;
        const columns = this.getColumns();
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <Table data={filteredData}
                   columns={columns}
                   headerRowRender={this.headerRowRender}
                   bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default UsersTable;