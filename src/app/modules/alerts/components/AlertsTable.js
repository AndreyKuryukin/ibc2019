import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import ls, { createLocalizer } from 'i18n';
import _ from 'lodash';
import Table from '../../../components/Table';
import { convertUTC0ToLocal } from '../../../util/date';
import { naturalSort } from '../../../util/sort';
import { DefaultCell, IconCell, LinkCell } from '../../../components/Table/Cells';
import { ALERTS_TYPES, CLIENTS_INCIDENTS_ALERTS } from '../constants';

const iconCellStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
};

class AlertsTable extends React.PureComponent {
    static contextTypes = {
        match: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALERTS_TYPES).isRequired,
        data: PropTypes.array,
        columns: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onReadNewAlert: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        columns: [],
        searchText: '',
        preloader: false,
        onReadNewAlert: () => null,
    };

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
        switch (column.name) {
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

    customSortFunction = (data, columnName, direction) => {
        const sortBy = columnName === 'raise_time' ? 'timestamp' : columnName;
        return naturalSort(data, [direction], node => [_.get(node, `${sortBy}`, '').toString()]);
    };

    rowClassGetter = node => node.new ? 'newAlert' : '';

    render() {
        const { data, searchText, preloader, total, columns } = this.props;

        return (
            <Table
                id="alerts-table"
                data={data}
                defaultSortColumn={'raise_time'}
                defaultSortDirection={'desc'}
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
