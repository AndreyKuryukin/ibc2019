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
import { ALERTS_TYPES, CLIENTS_INCIDENTS_ALERTS } from '../constants';

const iconCellStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
};

const ALERTS_STATUS_MAP = {
    'ACTIVE': ls('ALERTS_STATUS_ACTIVE', 'Текущая'),
    'CLOSED': ls('ALERTS_STATUS_CLOSED', 'Историческая')
};

class AlertsTable extends React.PureComponent {
    static contextTypes = {
        match: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALERTS_TYPES).isRequired,
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onReadNewAlert: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        onReadNewAlert: () => null,
    };

    static getColumns = memoize((type = CLIENTS_INCIDENTS_ALERTS) => {
        const commonColumns = [
            {
                getTitle: createLocalizer('ALERTS_ID_COLUMN', 'ID'),
                name: 'id',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALERTS_EXTERNAL_ID_COLUMN', 'ID во внешней системе'),
                name: 'external_id',
                resizable: true,
                searchable: true,
                sortable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALERTS_STATUS_COLUMN', 'Статус'),
                name: 'status',
                sortable: true,
                resizable: true,
                width: 100,
            }, {
                getTitle: createLocalizer('ALERTS_POLICY_NAME_COLUMN', 'Имя политики'),
                name: 'policy_name',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALERTS_NOTIFICATION_STATUS_COLUMN', 'Статус отправки во внешнюю систему'),
                name: 'notification_status',
                sortable: true,
                width: 250,
            }, {
                getTitle: createLocalizer('ALERTS_RAISE_TIME_COLUMN', 'Дата и время возникновения'),
                name: 'raise_time',
                searchable: true,
                sortable: true,
                width: 150,
            },  {
                getTitle: createLocalizer('ALERTS_CEASE_TIME_COLUMN', 'Дата и время закрытия'),
                name: 'cease_time',
                resizable: true,
                searchable: true,
                sortable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALERTS_DURATION_COLUMN', 'Длительность'),
                name: 'duration',
                searchable: true,
                sortable: true,
                width: 100,
            }
        ];

        const columnsByType = type === CLIENTS_INCIDENTS_ALERTS
                ? [{
                    getTitle: createLocalizer('ALERTS_MAC_COLUMN', 'MAC'),
                    name: 'mac',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                }, {
                    getTitle: createLocalizer('ALERTS_SAN_COLUMN', 'Service account number (SAN)'),
                    name: 'san',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                } , {
                    getTitle: createLocalizer('ALERTS_PERSONAL_ACCOUNT_COLUMN', 'Лицевой счёт'),
                    name: 'personal_account',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                }]
                : [{
                    getTitle: createLocalizer('ALERTS_OBJECT_COLUMN', 'Объект'),
                    name: 'object',
                    resizable: true,
                    searchable: true,
                    sortable: true,
                }];

        return commonColumns.concat(columnsByType);
    });

    onSelectRow = (node) => {
        if (node.new) {
            this.props.onReadNewAlert(node.id);
        }
    };

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
                        href={`/alerts/${this.props.type}/${node.id}`}
                        content={node[column.name]}
                        highlightedText={this.props.searchText}
                    />
                );
            case 'notification_status': {
                const status = _.get(node, 'notification_status', '');
                return status ? (
                    <IconCell
                        icon={`icon-state-${status.toLowerCase()}`}
                        iconTitle={ls(`ALERTS_STATUS_${status.toUpperCase()}`, 'Статус')}
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
            const nextPart = readableUnits + ls(`ALERTS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');
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
        status: ALERTS_STATUS_MAP[node.status] || '',
        timestamp: convertUTC0ToLocal(node.raise_time).valueOf(),
        new: !!node.new,
    }));

    customSortFunction = (data, columnName, direction) => {
        const sortBy = columnName === 'raise_time' ? 'timestamp' : columnName;
        return naturalSort(data, [direction], node => [_.get(node, `${sortBy}`, '').toString()]);
    };

    rowClassGetter = node => node.new ? 'newAlert' : '';

    render() {
        const { data, searchText, preloader, total } = this.props;
        const columns = AlertsTable.getColumns(this.context.match.params.type);
        const mappedData = this.mapData(data);

        return (
            <Table
                id="alerts-table"
                data={mappedData}
                columns={columns}
                customSortFunction={this.customSortFunction}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                rowClassGetter={this.rowClassGetter}
                onSelectRow={this.onSelectRow}
                preloader={preloader}
            />
        );
    }
}

export default AlertsTable;
