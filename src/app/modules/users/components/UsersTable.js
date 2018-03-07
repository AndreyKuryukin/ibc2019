import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../../../components/Table';
import { CheckedCell, DefaultCell, LinkCell } from '../../../components/Table/Cells';
import MailLink from "../../../components/MailLink/index";
import search from '../../../util/search';

class UsersTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
    };

    static defaultProps = {
        data: [],
        searchText: '',
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
            <Table
                selectable
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default UsersTable;