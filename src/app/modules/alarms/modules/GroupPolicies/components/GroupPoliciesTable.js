import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import ls from 'i18n';
import moment from 'moment';
import search from '../../../../../util/search';
import { convertUTC0ToLocal } from '../../../../../util/date';
import Table from '../../../../../components/Table';
import { DefaultCell, LinkCell } from '../../../../../components/Table/Cells';

class GroupPoliciesTable extends React.PureComponent {
    static contextTypes = {
        location: PropTypes.object.isRequired,
    };

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
            title: ls('ALARMS_GROUP_POLICIES_ID_COLUMN', 'ID'),
            name: 'id',
            searchable: true,
            sortable: true,
            width: 300,

        }, {
            title: ls('ALARMS_GROUP_POLICIES_PRIORITY_COLUMN', 'Приоритет'),
            name: 'priority',
            searchable: true,
            sortable: true,
            width: 150,

        }, {
            title: ls('ALARMS_GROUP_POLICIES_RAISE_TIME_COLUMN', 'Время возникновения'),
            name: 'raise_time',
            searchable: true,
            sortable: true,
            width: 150,

        }, {
            title: ls('ALARMS_GROUP_POLICIES_DURATION_COLUMN', 'Длительность'),
            name: 'duration',
            searchable: true,
            sortable: true,
            width: 150,
        }, {
            title: ls('ALARMS_GROUP_POLICIES_POLICY_NAME_COLUMN', 'Название политики по каталогу'),
            name: 'policy_name',
            searchable: true,
            sortable: true,
            width: 250,
        }
    ]));

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALARMS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    mapData = memoize((data) => data.map((node) => ({
        id: node.id.toString(),
        priority: node.priority,
        raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD:MM:YYYY'),
        duration: this.getReadableDuration(node.duration),
        policy_name: node.policy_name,
    })));

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
                        href={`/alarms/group-policies/current/${node.id}${this.context.location.search}`}
                        content={node[column.name].toString()}
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
        const mappedData = this.mapData(data);
        const columns = GroupPoliciesTable.getColumns();
        const filteredData = searchText ? this.filter(mappedData, columns.filter(col => col.searchable), searchText) : mappedData;

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

export default GroupPoliciesTable;
