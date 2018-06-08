import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import ls from 'i18n';
import memoize from 'memoizejs';
import { createSelector } from 'reselect';
import TreeView from '../../../components/TreeView';
import { DefaultCell, IconCell } from '../../../components/Table/Cells';
import styles from './styles.scss';
import ReportCell from './ReportCell';
import { DATE_TIME } from '../../../costants/date';
import search from '../../../util/search';
import { convertUTC0ToLocal } from '../../../util/date';

class ReportsTable extends React.PureComponent {
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onRemoveResult: PropTypes.func,
        onResultRetry: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        onRemoveResult: () => null,
        onResultRetry: () => null,
    };

    static getColumns = memoize(hasEditAccess => [{
        title: ls('REPORTS_NAME_COLUMN_TITLE', 'Название отчёта'),
        name: 'name',
        sortable: true,
        searchable: true,
        width: 500
    }, {
        title: ls('REPORTS_CREATED_COLUMN_TITLE', 'Создан'),
        name: 'end',
        sortable: true,
        searchable: true,
        width: 130
    }, {
        title: '',
        name: 'retry',
        width: 40
    }, {
        title: ls('REPORTS_STATE_COLUMN_TITLE', 'Состояние'),
        name: 'state',
        width: 75
    }, {
        title: ls('REPORTS_FORMAT_COLUMN_TITLE', 'Формат'),
        name: 'type',
        sortable: true,
        searchable: true,
        width: 60
    }, {
        title: ls('REPORTS_AUTHOR_COLUMN_TITLE', 'Автор'),
        name: 'author',
        sortable: true,
        searchable: true,
    }, {
        title: ls('REPORTS_COMMENT_COLUMN_TITLE', 'Комментарий'),
        name: 'comment',
        sortable: true,
        searchable: true,
    }, {
        title: ls('REPORTS_RECEIVERS_COLUMN_TITLE', 'Получат отчёт'),
        name: 'notify',
        sortable: true,
        searchable: true,
        width: 200
    }, ...(hasEditAccess ? [{
        title: '',
        name: 'delete',
        width: 25
    }] : [])]);

    getReportTimeStatus = (report) => {
        switch(report.state) {
            case 'RUNNING': {
                return `c ${report.start}`;
            }
            case 'FAILED':
            case 'SUCCESS':
                return `в ${report.end}`;
            default:
                return '';
        }
    };

    mapReport = (config, report, isLastSuccess) => ({
        id: report.id,
        name: report.name,
        path: report.file_path,
        start: report.create_start_time ? convertUTC0ToLocal(report.create_start_time).format(DATE_TIME) : '',
        end: report.create_end_time ? convertUTC0ToLocal(report.create_end_time).format(DATE_TIME) : '',
        state: report.state,
        type: config.type,
        nodeType: 'report',
    });


    mapConfig = config => ({
        id: config.id,
        type: config.type,
        nodeType: 'config',
        author: config.author_name,
        comment: config.comment,
        notify: config.notify_users && Array.isArray(config.notify_users) ? config.notify_users.join(', ') : '',
        name: config.name,
        children: (config.reports || []).map((() => {
            let lastSuccessEnd = 0;
            return (report) => {
                const state = _.get(report, 'state', '').toLowerCase();
                const create_end = moment(_.get(report, 'create_end')).unix();
                if ((state === 'success' || state === 'running') && create_end >= lastSuccessEnd) {
                    lastSuccessEnd = create_end;
                }
                return this.mapReport(config, report, () => create_end === lastSuccessEnd);
            }
        })()),
    });

    mapTemplate = template => ({
        id: template.id,
        nodeType: 'template',
        name: template.name,
        children: _.get(template, 'report_config', []).map(this.mapConfig),
    });

    mapGroups = group => ({
        id: group.type,
        name: group.type,
        children: _.get(group, 'templates', []).map(this.mapTemplate)
    });

    mapData = createSelector(
        props => props.data,
        data => data.map(this.mapGroups)
    );

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    remove = (node) => {
        switch (node.type) {
            case 'PDF':
            case 'XLS':
                this.props.onRemoveResult(node.id, _.last(node.parents))
        }
    };

    bodyRowRender = (column, node) => {
        switch (column.name) {
            case 'name':
                const type = _.get(node, 'type', '');
                const state = _.get(node, 'state', '').toLowerCase();
                return (
                    <ReportCell
                        formatIcon={type && `icon-${type.toLowerCase()}`}
                        iconTitle={type && type.toUpperCase()}
                        text={node[column.name]}
                        disabled={node.state === 'FAILED'}
                        href={state !== 'failed' && state !== 'running' && node.path}
                    />
                );
            case 'retry': {
                const state = _.get(node, 'state', '').toLowerCase();
                return state === 'failed' || (node.isLastSuccess && node.isLastSuccess() && state !== 'running') ?
                    <IconCell
                        icon={`icon-retry`}
                        iconProps={{
                            title: ls(`REPORTS_REGENERATE`, 'Перестроить')
                        }}
                        onIconClick={() => this.props.onResultRetry(node.id)}
                        cellStyle={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    /> : ''
            }
            case 'type': {
                const type = _.get(node, 'type', '');
                return (node.nodeType === 'config') ? <DefaultCell
                        content={ls(`REPORT_TYPE_${String(type).toUpperCase()}`, '')}
                    /> : '';
            }
            case 'state': {
                const state = _.get(node, 'state', '').toLowerCase();
                return <IconCell
                    icon={`icon-state-${state}`}
                    iconProps={{
                        title: `${ls(`REPORTS_STATUS_${state.toUpperCase()}`, 'Статус')} ${state ? this.getReportTimeStatus(node) : ''}`
                    }}
                    cellStyle={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                />;
            }
            case 'delete': {
                return (node.type === 'PDF' || node.type === 'XLS') &&
                    <div className={styles.deleteStyle} onClick={() => this.remove(node)}>×</div>;
            }
            default:
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
        }
    };

    filter = (data, searchableColumns, searchText) =>
        data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText))
            || (node.children && this.filter(node.children, searchableColumns, searchText).length > 0)
        );

    render() {
        const mappedData = this.mapData(this.props);
        const { searchText } = this.props;
        const columns = ReportsTable.getColumns(this.context.hasAccess('REPORTS', 'EDIT'));
        const filteredData = searchText ? this.filter(mappedData, columns.filter(col => col.searchable), searchText) : mappedData;

        return (
            <TreeView
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
            />
        );
    }
}

export default ReportsTable;
