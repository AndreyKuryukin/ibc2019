import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import memoize from 'memoizejs';
import search from '../../../util/search';
import Table from '../../../components/Table';
import { CheckedCell, DefaultCell, LinkCell } from '../../../components/Table/Cells';
import ls from "i18n";

class RolesTable extends React.PureComponent {
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        checked: [],
        searchText: '',
        preloader: false,
        onCheck: () => null,
    };

    constructor(props) {
        super(props);
    }

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.props.checked, node.id] : _.without(this.props.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.props.onCheck(checked);
    };

    static getColumns = memoize(hasEditAccess => ([
        ...(hasEditAccess ? [{
            name: 'checked',
            width: 28,
        }] : []),
        {
            getTitle: () => ls('ROLES_NAME', 'Имя роли'),
            name: 'name',
            resizable: true,
            searchable: true,
            sortable: true,
        },
        // {
        //     title: ls('ROLES_NUMBER_OF_USERS', 'Количество пользователей'),
        //     name: 'number',
        //     searchable: true,
        //     width: 200,
        //     sortable: true,
        // },
        {
            getTitle: () => ls('ROLES_DESCRIPTION', 'Описание'),
            name: 'description',
            resizable: true,
            searchable: true,
            sortable: true,
        }
    ]));

    headerRowRender = (column, sort) => {
        const sortDirection = sort.by === column.name ? sort.direction : null;
        switch (column.name) {
            case 'checked': {
                const checkedPartially = this.props.data.length !== 0 && this.props.checked.length > 0 && this.props.checked.length < this.props.data.length;
                const isAllChecked = !checkedPartially && this.props.data.length !== 0 && this.props.checked.length === this.props.data.length;
                return (
                    <CheckedCell
                        id="roles-all"
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
                        content={column.getTitle ? column.getTitle() : ''}
                        sortDirection={sortDirection}
                    />
                );
        }
    }

    bodyRowRender = (column, node) => {
        const text = node[column.name];
        switch (column.name) {
            case 'checked': {
                const isRowChecked = this.props.checked.includes(node.id);
                return (
                    <CheckedCell
                        id={`roles-role-${node.id}`}
                        onChange={(value) => this.onCheck(value, node)}
                        style={{ marginLeft: 0 }}
                        value={isRowChecked}
                    />
                );
            }
            case 'name':
                return this.context.hasAccess('ROLES', 'EDIT') ? (
                    <LinkCell
                        href={`/users-and-roles/roles/edit/${node.id}`}
                        content={text}
                    />
                ) : (
                    <DefaultCell
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
        const { data, searchText, preloader } = this.props;
        const hasEditAccess = this.context.hasAccess('ROLES', 'EDIT');
        const columns = RolesTable.getColumns(hasEditAccess);
        const resultData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <Table
                id="roles-table"
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                data={resultData}
                columns={columns}
                preloader={preloader}
            />
        );
    }
}

export default RolesTable;
