import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';

import Table from '../../../components/Table';
import { DefaultCell, LinkCell } from '../../../components/Table/Cells'
import PolicyCell from './PolicyCell';
import search from '../../../util/search';

class PoliciesTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
    }

    getColumns = () => [{
        title: ls('POLICIES_NAME_COLUMN_TITLE', 'Название'),
        name: 'name',
        sortable: true,
        searchable: true,
    }, {
        title: ls('POLICIES_CONDITION_COLUMN_TITLE', 'Условие'),
        name: 'condition',
        sortable: true,
        searchable: true,
    }, {
        title: ls('POLICIES_AGREGATION_COLUMN_TITLE', 'Функция агрегации'),
        name: 'agregation',
        sortable: true,
        searchable: true,
        filter: {
            type: 'text',
        },
    }, {
        title: ls('POLICIES_AGREGATION_INTERVAL_COLUMN_TITLE', 'Интервал агрегации'),
        name: 'agregation_interval',
        sortable: true,
        searchable: true,
        columns: [{
            title: ls('POLICIES_CALL_COLUMN_TITLE', 'Вызов'),
            name: 'call',
        }, {
            title: ls('POLICIES_ENDING_COLUMN_TITLE', 'Окончание'),
            name: 'ending',
        }],
    }, {
        title: ls('POLICIES_THRESHOLD_COLUMN_TITLE', 'Порог'),
        name: 'threshold',
        sortable: true,
        searchable: true,
        columns: [{
            title: ls('POLICIES_CALL_COLUMN_TITLE', 'Вызов'),
            name: 'call',
        }, {
            title: ls('POLICIES_ENDING_COLUMN_TITLE', 'Окончание'),
            name: 'ending',
        }],
    }, {
        title: ls('POLICIES_SCOPE_COLUMN_TITLE', 'Область действия'),
        name: 'scope',
        sortable: true,
        searchable: true,
    }];

    headerRowRender = (column, sort) => {
        const sortDirection = sort.by === column.name ? sort.direction : null;

        switch(column.name) {
            case 'agregation_interval':
            case 'threshold':
                return (
                    <PolicyCell
                        title={column.title}
                        name={column.name}
                        columns={column.columns}
                        sort={sort}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={column.title}
                        sortDirection={sortDirection}
                    />
                );
        }
    };

    bodyRowRender = (column, node) => {
        switch(column.name) {
            case 'name':
                return (
                    <LinkCell
                        href={`/policies/edit/${node.id}`}
                        content={node[column.name]}
                    />
                );
            case 'agregation_interval':
            case 'threshold':
                return (
                    <PolicyCell
                        columns={column.columns.map(col => ({ title: _.get(node, `${column.name}.${col.name}`, ''), name: col.name }))}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
        }
    };

    filterBySearchText = (data, columns, searchText) => {
        const searchableColumns = columns.filter(column => column.searchable);

        return data.filter(
            node => searchableColumns.reduce((result, nextColumn) => {
                let value = node[nextColumn.name];
                let isValid = search(value, searchText);
                if (nextColumn.name === 'agregation_interval' || nextColumn.name === 'threshold') {
                    isValid = nextColumn.columns.reduce(
                        (valid, nextCol) => valid || search(value[nextCol.name], searchText),
                        false);
                }
                return result || isValid;
            }, false)
        );
    }

    render() {
        const columns = this.getColumns();
        const { data, searchText } = this.props;
        const filteredData = searchText ? this.filterBySearchText(data, columns, searchText) : data;
        return (
            <Table
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                data={filteredData}
                columns={columns}
            />
        );
    }
}

export default PoliciesTable;
