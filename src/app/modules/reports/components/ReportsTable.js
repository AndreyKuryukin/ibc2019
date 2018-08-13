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

const iconCellStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
};

const TEMPLATE_NAMES_MAP = {
    ACCIDENT_REPORT: ls('ACCIDENT_REPORT', "Отчёт об авариях"),
    DEGRADATION_QUALITY: ls('DEGRADATION_QUALITY', "Отчет с гарантированной деградацией качества"),
    KGS_BY_CHANNEL: ls('KGS_BY_CHANNEL', "Отчёт Кгс в проекции по каналам"),
    KAB_FOR_ACCESS: ls('KAB_FOR_ACCESS', "Отчёт Каб в проекции на коммутаторы доступа"),
    KAB_FOR_AGGREGATION: ls('KAB_FOR_AGGREGATION', "Отчёт Каб в проекции на коммутаторы агрегации"),
    REPORT_IPTV: ls('REPORT_IPTV', "Базовый отчёт IPTV"),
    REPORT_OTT: ls('REPORT_OTT', "Базовый отчёт ОТТ")
};

class ReportsTable extends React.PureComponent {
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        data: PropTypes.array,
        users: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onRemoveResult: PropTypes.func,
        onResultRetry: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        users: [],
        searchText: '',
        preloader: false,
        onRemoveResult: () => null,
        onResultRetry: () => null,
    };

    static getColumns = memoize(hasEditAccess => [{
        getTitle: () => ls('REPORTS_NAME_COLUMN_TITLE', 'Название отчёта'),
        name: 'name',
        resizable: true,
        sortable: true,
        searchable: true,
        width: 500
    }, {
        getTitle: () => ls('REPORTS_CREATED_COLUMN_TITLE', 'Создан'),
        name: 'end',
        resizable: true,
        sortable: true,
        searchable: true,
        width: 130,
        extractor: node => new Date(node.create_end_time).getTime()
    }, {
        name: 'retry',
        width: 40
    }, {
        getTitle: () => ls('REPORTS_STATE_COLUMN_TITLE', 'Состояние'),
        name: 'state',
        width: 75
    }, {
        getTitle: () => ls('REPORTS_FORMAT_COLUMN_TITLE', 'Формат'),
        name: 'type',
        sortable: true,
        searchable: true,
        width: 60
    }, {
        getTitle: () => ls('REPORTS_AUTHOR_COLUMN_TITLE', 'Автор'),
        name: 'author',
        resizable: true,
        sortable: true,
        searchable: true,
    }, {
        getTitle: () => ls('REPORTS_COMMENT_COLUMN_TITLE', 'Комментарий'),
        name: 'comment',
        resizable: true,
        sortable: true,
        searchable: true,
    }, {
        getTitle: () => ls('REPORTS_RECEIVERS_COLUMN_TITLE', 'Получат отчёт'),
        name: 'notify',
        resizable: true,
        sortable: true,
        searchable: true,
        width: 200
    }, ...(hasEditAccess ? [{
        name: 'delete',
        width: 25
    }] : [])]);

    getReportTimeStatus = (report) => {
        switch (report.state) {
            case 'RUNNING': {
                return `${ls('REPORTS_FROM_PREPOSITION', 'с')} ${report.start}`;
            }
            case 'FAILED':
            case 'SUCCESS':
                return `${ls('REPORTS_IN_PREPOSITION', 'в')} ${report.end}`;
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
        create_end_time: report.create_end_time,
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
        notify: _.isArray(config.notify_users) ? config.notify_users : [],
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
        name: TEMPLATE_NAMES_MAP[template.type] || '',
        children: _.get(template, 'report_config', []).map(this.mapConfig),
    });

    mapGroups = group => ({
        id: group.type,
        name: ls(`REPORTS_${group.type}_GROUP_NAME`, group.type),
        children: _.get(group, 'templates', []).map(this.mapTemplate)
    });

    mapData = createSelector(
        props => props.data,
        data => data.map(this.mapGroups)
    );

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.getTitle ? column.getTitle() : ''}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    remove = (node) => {
        switch (node.type) {
            case 'PDF':
            case 'XLSX':
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
                            title: ls('REPORTS_REGENERATE', 'Перестроить'),
                        }}
                        onIconClick={() => this.props.onResultRetry(node.id)}
                        cellStyle={iconCellStyle}
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
                    cellStyle={iconCellStyle}
                />;
            }
            case 'delete': {
                return (node.nodeType === 'report') &&
                    <div className={styles.deleteStyle} onClick={() => this.remove(node)}>×</div>;
            }
            case 'notify': {
                const users = _.get(node, column.name, []).map(id => {
                    const user = _.find(this.props.users, { id });
                    if (user) {
                        return user.login;
                    }
                }).join(', ');
                return <DefaultCell
                    content={users}
                />
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
                id="reports-table"
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
