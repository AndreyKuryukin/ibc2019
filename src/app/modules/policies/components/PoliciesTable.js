import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';

import Table from '../../../components/Table';
import { DefaultCell, LinkCell } from '../../../components/Table/Cells';
import PolicyCell from './PolicyCell';
import search from '../../../util/search';
import styles from './styles.scss';

class PoliciesTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
    }

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
    }

    getColumns = () => [{
        title: ls('POLICIES_NAME_COLUMN_TITLE', 'Название'),
        name: 'name',
        sortable: true,
        searchable: true,
        filter: {
            type: 'text',
        },
    },
    // {
    //     title: ls('POLICIES_CONDITION_COLUMN_TITLE', 'Условие'),
    //     name: 'condition',
    //     sortable: true,
    //     searchable: true,
    // }, {
    //     title: ls('POLICIES_AGREGATION_COLUMN_TITLE', 'Функция агрегации'),
    //     name: 'agregation',
    //     sortable: true,
    //     searchable: true,
    //     filter: {
    //         type: 'text',
    //     },
    // },
    {
        title: ls('POLICIES_AGGREGATION_INTERVAL_COLUMN_TITLE', 'Интервал агрегации'),
        name: 'aggregation_interval',
        sortable: true,
        searchable: true,
        columns: [{
            title: ls('POLICIES_RISE_COLUMN_TITLE', 'Вызов'),
            name: 'rise_duration',
        }, {
            title: ls('POLICIES_CEASE_COLUMN_TITLE', 'Окончание'),
            name: 'cease_duration',
        }],
    }, {
        title: ls('POLICIES_THRESHOLD_COLUMN_TITLE', 'Порог'),
        name: 'threshold',
        sortable: true,
        searchable: true,
        columns: [{
            title: ls('POLICIES_RISE_COLUMN_TITLE', 'Вызов'),
            name: 'rise_value',
        }, {
            title: ls('POLICIES_CEASE_COLUMN_TITLE', 'Окончание'),
            name: 'cease_value',
        }],
    },
    // {
    //     title: ls('POLICIES_SCOPE_COLUMN_TITLE', 'Область действия'),
    //     name: 'scope',
    //     sortable: true,
    //     searchable: true,
    // }
    ];

    headerRowRender = (column, sort) => {
        const sortDirection = sort.by === column.name ? sort.direction : null;

        switch(column.name) {
            case 'aggregation_interval':
            case 'threshold':
                return (
                    <PolicyCell
                        title={column.title}
                        name="threshold"
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
            case 'aggregation_interval':
            case 'threshold':
                return (
                    <PolicyCell
                        columns={column.columns.map(col => ({ title: _.get(node, `threshold.${col.name}`, ''), name: col.name }))}
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
                let isValid = nextColumn.name === 'aggregation_interval' || nextColumn.name === 'threshold'
                    ? nextColumn.columns.reduce(
                        (valid, nextCol) => valid || search(_.get(node, `threshold.${nextCol.name}`), searchText),
                        false)
                    : search(value, searchText);
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
                className={styles.policyTable}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                data={filteredData}
                columns={columns}
                preloader={this.props.preloader}
            />
        );
    }
}

export default PoliciesTable;
