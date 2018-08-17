import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import ls, { createLocalizer } from 'i18n';
import _ from 'lodash';
import search from '../../../util/search';
import Table from '../../../components/Table';
import { convertUTC0ToLocal } from '../../../util/date';
import { naturalSort } from '../../../util/sort';
import { DefaultCell, LinkCell, IconCell } from '../../../components/Table/Cells';
import { ALARMS_TYPES, CLIENTS_INCIDENTS_ALARMS } from '../constants';

const iconCellStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
};

class AlarmsTable extends React.PureComponent {
    static contextTypes = {
        match: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
    };

    static getColumns = memoize((type = CLIENTS_INCIDENTS_ALARMS) => {
        const commonColumns = [
            {
                getTitle: createLocalizer('ALARMS_ID_COLUMN', 'ID'),
                name: 'id',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALARMS_EXTERNAL_ID_COLUMN', 'ID во внешней системе'),
                name: 'external_id',
                resizable: true,
                searchable: true,
                sortable: true,
                searchable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALARMS_STATUS_COLUMN', 'Статус'),
                name: 'status',
                sortable: true,
                resizable: true,
                width: 100,
            }, {
                getTitle: createLocalizer('ALARMS_POLICY_NAME_COLUMN', 'Имя политики'),
                name: 'policy_name',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALARMS_NOTIFICATION_STATUS_COLUMN', 'Статус отправки во внешнюю систему'),
                name: 'notification_status',
                sortable: true,
                width: 250,
            }, {
                getTitle: createLocalizer('ALARMS_RAISE_TIME_COLUMN', 'Дата и время возникновения'),
                name: 'raise_time',
                searchable: true,
                sortable: true,
                width: 150,
            },  {
                getTitle: createLocalizer('ALARMS_CEASE_TIME_COLUMN', 'Дата и время закрытия'),
                name: 'cease_time',
                resizable: true,
                searchable: true,
                sortable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALARMS_DURATION_COLUMN', 'Длительность'),
                name: 'duration',
                searchable: true,
                sortable: true,
                width: 100,
            }
        ];

        const columnsByType = type === CLIENTS_INCIDENTS_ALARMS
                ? [{
                    getTitle: createLocalizer('ALARMS_MAC_COLUMN', 'MAC'),
                    name: 'mac',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                }, {
                    getTitle: createLocalizer('ALARMS_SAN_COLUMN', 'Service account number (SAN)'),
                    name: 'san',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                } , {
                    getTitle: createLocalizer('ALARMS_PERSONAL_ACCOUNT_COLUMN', 'Лицевой счёт'),
                    name: 'personal_account',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                }]
                : [{
                    getTitle: createLocalizer('ALARMS_OBJECT_COLUMN', 'Объект'),
                    name: 'object',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                }];

        return commonColumns.concat(columnsByType);
    });

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
                        highlightedText={this.props.searchText}
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
                        highlightedText={this.props.searchText}
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

    mapData = data => data.map(node => ({
        id: node.id.toString(),
        external_id: node.external_id || '',
        policy_name: node.policy_name,
        notification_status: node.notification_status || '',
        raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD.MM.YYYY'),
        cease_time: node.cease_time ? convertUTC0ToLocal(node.cease_time).format('HH:mm DD.MM.YYYY') : '',
        duration: this.getReadableDuration(node.duration),
        object: node.object || '',
        personal_account: node.personal_account || '',
        san: node.san || '',
        mac: node.mac || '',
        status: node.status || '',
        timestamp: convertUTC0ToLocal(node.raise_time).valueOf(),
    }));

    customSortFunction = (data, columnName, direction) => {
        const sortBy = columnName === 'raise_time' ? 'timestamp' : columnName;

        return naturalSort(data, [direction], node => [_.get(node, `${sortBy}`, '').toString()]);
    };

    render() {
        const { data, searchText, preloader, total } = this.props;
        const columns = AlarmsTable.getColumns(this.context.match.params.type);
        const mappedData = this.mapData(data);

        return (
            <Table
                id="alarms-table"
                data={mappedData}
                columns={columns}
                customSortFunction={this.customSortFunction}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={preloader}
                showStatistics
            />
        );
    }
}

export default AlarmsTable;
