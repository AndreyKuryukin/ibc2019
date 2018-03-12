import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../../../components/Table';
import { CheckedCell, DefaultCell, LinkCell } from '../../../components/Table/Cells';
import MailLink from "../../../components/MailLink/index";

class UsersTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
    };

    static defaultProps = {
        data: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: [],
        };
    }

    getColumns = () => [{
        name: 'checked',
    }, {
        title: 'Логин',
        name: 'login',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Имя',
        name: 'name',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Email',
        name: 'email',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Номер телефона',
        name: 'phone',
        searchable: true,
        sortable: true,
        filter: {
            type: 'number',
        }
    }, {
        title: 'Роли',
        name: 'roles',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Подразделения',
        name: 'divisions',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Группы уведомлений',
        name: 'groups',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Создан',
        name: 'created',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Последний логин',
        name: 'last_connection',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        }
    }, {
        title: 'Активен',
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
                    <LinkCell
                        href={`/users/edit/${node.id}`}
                        content={text}
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

    render() {
        const columns = this.getColumns();

        return (
            <Table
                selectable
                data={this.props.data}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default UsersTable;