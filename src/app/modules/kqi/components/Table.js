import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';

import search from '../../../util/search';
import Table from '../../../components/Table';
import { DefaultCell } from '../../../components/Table/Cells';

export class KQITable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
    };

    getColumns = () => [{
        title: ls('KQI_BRANCH_COLUMN_TITLE', 'Филиал'),
        name: 'branch',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_TECHNOLOGY_COLUMN_TITLE', 'Технология ПМ'),
        name: 'technology',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_RESULT_COLUMN_TITLE', 'Результат'),
        name: 'result',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_WEIGHT_COLUMN_TITLE', 'Вносимый вес'),
        name: 'weight',
        searchable: true,
        sortable: true,
    }];

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => (
        <DefaultCell
            content={node[column.name]}
        />
    );

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
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default KQITable;
