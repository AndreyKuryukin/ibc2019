import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import search from '../../../../../util/search';
import TreeView from '../../../../../components/TreeView';
import { DefaultCell } from '../../../../../components/Table/Cells';

const mock = [{
    id: 1,
    branch: 'Нижегородский',
    result: '99%',
    weight: '0.1',
    children: [{
        id: 2,
        branch: 'DSL',
        result: '98%',
        weight: '0.2',
    }, {
        id: 3,
        branch: 'GPON',
        result: '92%',
        weight: '0.15',
    }, {
        id: 4,
        branch: 'Ethernet',
        result: '93.5%',
        weight: '0.1',
    }],
}];

class ResultsTable extends React.PureComponent {
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

    render() {
        const { data, searchText } = this.props;
        const columns = this.getColumns();
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;

        return (
            <TreeView
                data={mock}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
            />
        );
    }
}

export default ResultsTable;
