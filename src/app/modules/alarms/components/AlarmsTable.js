import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import ls from 'i18n';
import moment from 'moment';
import search from '../../../util/search';
import Table from '../../../components/Table';
import { DefaultCell, LinkCell } from '../../../components/Table/Cells';

class AlarmsTable extends React.PureComponent {
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

    static getColumns = memoize(() => ([
        {
            title: ls('ALARMS_ID_COLUMN', 'ID'),
            name: 'id',
            searchable: true,
            sortable: true,
            width: 150,
        }, {
            title: ls('ALARMS_POLICY_NAME_COLUMN', 'Имя политики'),
            name: 'policy_name',
            searchable: true,
            sortable: true,
            width: 500,
        }, {
            title: ls('ALARMS_RAISE_TIME_COLUMN', 'Время возникновения'),
            name: 'raise_time',
            searchable: true,
            sortable: true,
            width: 150,
        }, {
            title: ls('ALARMS_DURATION_COLUMN', 'Длительность'),
            name: 'duration',
            searchable: true,
            sortable: true,
            width: 120,
        }, {
            title: ls('ALARMS_OBJECT_COLUMN', 'Объект'),
            name: 'object',
            searchable: true,
            sortable: true,
        }
    ]));

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch(column.name) {
            case 'id':
                return (
                    <LinkCell
                        href={`/alarms/group-policies/current/${node.id}`}
                        content={node[column.name]}
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

    filter = (data, searchableColumns, searchText) => data.filter(node => searchableColumns.find(column => search(node[column.name], searchText)));

    render() {
        const { data, searchText, preloader } = this.props;
        const columns = AlarmsTable.getColumns();
        const filteredData = searchText ? this.filter(data, columns.filter(col => col.searchable), searchText) : data;
        return (
            <Table
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={preloader}
            />
        );
    }
}

export default AlarmsTable;
