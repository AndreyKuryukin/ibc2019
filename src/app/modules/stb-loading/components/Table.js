import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';

import Table from '../../../components/Table';
import { DefaultCell } from '../../../components/Table/Cells';

export class StbLoadingTable extends React.PureComponent {
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
        title: ls('STB_LOADING_SERVICE_COLUMN_TITLE', 'Услуга'),
        name: 'service',
        searchable: true,
        sortable: true,
    }, {
        title: ls('STB_LOADING_PRODUCER_COLUMN_TITLE', 'Производитель оборудования'),
        name: 'vendor',
        searchable: true,
        sortable: true,
    }, {
        title: ls('STB_LOADING_MODEL_COLUMN_TITLE', 'Модель'),
        name: 'model',
        searchable: true,
        sortable: true,
    }, {
        title: ls('STB_LOADING_SW_VERSION_COLUMN_TITLE', 'Версия ПО'),
        name: 'swVersion',
        searchable: true,
        sortable: true,
    }, {
        title: ls('STB_LOADING_LOADING_TIME_COLUMN_TITLE', 'Среднее время загрузки'),
        name: 'loadingTime',
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
        return (
            <Table
                data={data}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default StbLoadingTable;
