import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import search from '../../../util/search';
import Table from '../../../components/Table';
import { CheckedCell, DefaultCell, LinkCell } from '../../../components/Table/Cells';
import ls from "i18n";

class RolesTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onCheck: PropTypes.func,
    }

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        onCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: [],
        };
    }

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.props.onCheck(checked);

        this.setState({
            checked,
        });
    };

    getColumns = () => ([{
        name: 'checked',
    }, {
        title: ls('ROLES_NAME', 'Название'),
        name: 'name',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }, {
        title: ls('ROLES_SUBJECTS', 'Разрешения'),
        name: 'description',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }, {
        title: ls('ROLES_DESCRIPTION', 'Описание'),
        name: 'description',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }
    ]);

    headerRowRender = (column, sort) => {
        const sortDirection = sort.by === column.name ? sort.direction : null;
        switch (column.name) {
            case 'checked': {
                const checkedPartially = this.props.data.length !== 0 && this.state.checked.length > 0 && this.state.checked.length < this.props.data.length;
                const isAllChecked = !checkedPartially && this.props.data.length !== 0 && this.state.checked.length === this.props.data.length;
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
                        content={column.title}
                        sortDirection={sortDirection}
                    />
                );
        }
    }

    bodyRowRender = (column, node) => {
        const text = node[column.name];
        switch (column.name) {
            case 'checked': {
                const isRowChecked = this.state.checked.includes(node.id);
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
                return (
                    <LinkCell
                        href={`/roles/edit/${node.id}`}
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
    }

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    render() {
        const { data, searchText } = this.props;
        const columns = this.getColumns();
        const resultData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <Table headerRowRender={this.headerRowRender}
                   bodyRowRender={this.bodyRowRender}
                   data={resultData}
                   columns={columns}/>
        );
    }
}

export default RolesTable;
