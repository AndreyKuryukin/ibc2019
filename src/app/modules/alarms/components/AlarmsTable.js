import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import ls from 'i18n';
import _ from 'lodash';
import search from '../../../util/search';
import Table from '../../../components/Table';
import { convertUTC0ToLocal } from '../../../util/date';
import { naturalSort } from '../../../util/sort';
import { DefaultCell, LinkCell, IconCell } from '../../../components/Table/Cells';
import { ALARMS_TYPES } from '../constants';

const iconCellStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
};

class AlarmsTable extends React.PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onDisplayedDataChanged: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        onDisplayedDataChanged: () => null,
    };

    static getColumns = memoize(() => ([
        {
            getTitle: () => ls('ALARMS_ID_COLUMN', 'ID'),
            name: 'id',
            resizable: true,
            searchable: true,
            sortable: true,
        }, {
            getTitle: () => ls('ALARMS_EXTERNAL_ID_COLUMN', 'ID во внешней системе'),
            name: 'external_id',
            resizable: true,
            searchable: true,
            sortable: true,
            searchable: true,
            width: 150,
        }, {
            getTitle: () => ls('ALARMS_POLICY_NAME_COLUMN', 'Имя политики'),
            name: 'policy_name',
            resizable: true,
            searchable: true,
            sortable: true,
        }, {
            getTitle: () => ls('ALARMS_NOTIFICATION_STATUS_COLUMN', 'Статус отправки во внешнюю систему'),
            name: 'notification_status',
            sortable: true,
            width: 250,
        }, {
            getTitle: () => ls('ALARMS_RAISE_TIME_COLUMN', 'Время возникновения'),
            name: 'raise_time',
            searchable: true,
            sortable: true,
            width: 150,
        }, {
            getTitle: () => ls('ALARMS_DURATION_COLUMN', 'Длительность'),
            name: 'duration',
            searchable: true,
            sortable: true,
            width: 100,
        }, {
            getTitle: () => ls('ALARMS_OBJECT_COLUMN', 'Объект'),
            name: 'object',
            resizable: true,
            searchable: true,
            sortable: true,
        }
    ]));

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.getTitle ? column.getTitle() : ''}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch(column.name) {
            case 'id':
                return (
                    <LinkCell
                        href={`/alarms/${this.props.type}/${node.id}`}
                        content={node[column.name]}
                    />
                );
            case 'notification_status': {
                const status = _.get(node, 'notification_status', '');
                return status ? (
                    <IconCell
                        icon={`icon-state-${status.toLowerCase()}`}
                        iconTitle={ls(`ALARMS_STATUS_${status.toUpperCase()}`, 'Статус')}
                        cellStyle={iconCellStyle}
                    />
                ) : (
                    <DefaultCell
                        content={''}
                    />
                );
            }
            default:
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
        }
    };

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALARMS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    mapData = memoize(data => data.map(node => ({
        id: node.id.toString(),
        external_id: node.external_id || '',
        policy_name: node.policy_name,
        notification_status: node.notification_status || '',
        raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD.MM.YYYY'),
        duration: this.getReadableDuration(node.duration),
        object: node.object || '',
        timestamp: convertUTC0ToLocal(node.raise_time).valueOf(),
    })));

    customSortFunction = (data, columnName, direction) => {
        const sortBy = columnName === 'raise_time' ? 'timestamp' : columnName;
        const sortedData = naturalSort(data, [direction], node => [_.get(node, `${sortBy}`, '').toString()]);
        this.props.onDisplayedDataChanged(sortedData);

        return sortedData;
    };

    filter = (data, searchableColumns, searchText) => data.filter(node => searchableColumns.find(column => search(node[column.name], searchText)));

    render() {
        const { data, searchText, preloader } = this.props;
        const columns = AlarmsTable.getColumns();
        const mappedData = this.mapData(data);
        const filteredData = searchText ? this.filter(mappedData, columns.filter(col => col.searchable), searchText) : mappedData;

        return (
            <Table
                id="alarms-table"
                data={filteredData}
                columns={columns}
                customSortFunction={this.customSortFunction}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={preloader}
            />
        );
    }
}

export default AlarmsTable;
