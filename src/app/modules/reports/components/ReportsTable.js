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

class ReportsTable extends React.PureComponent {
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

    static getColumns = memoize(() => [{
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
    }, {
        title: '',
        name: 'retry',
        sortable: false,
        searchable: false,
        width: 40
    }, {
        title: ls('REPORTS_STATE_COLUMN_TITLE', 'Состояние'),
        name: 'state',
        sortable: true,
        searchable: true,
        width: 75
    }, {
        title: ls('REPORTS_FORMAT_COLUMN_TITLE', 'Формат'),
        name: 'type',
        sortable: true,
        searchable: true,
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
    }, {
        title: '',
        name: 'delete',
        width: 25
    }]);

    getReportTimeStatus = (report) => {
        switch(report.state) {
            case 'RUNNING': {
                return `c ${moment(report.start).format(DATE_TIME)}`;
            }
            case 'FAILED':
            case 'SUCCESS':
                return `в ${moment(report.end).format(DATE_TIME)}`;
            default:
                return '';
        }
    };

    mapReport = (config, report, isLastSuccess) => ({
        id: report.id,
        name: report.name,
        path: report.file_path,
        start: report.create_start_time,
        end: report.create_end_time,
        state: report.state,
        type: config.type,
        author: config.author,
        comment: config.comment,
        notify: config.notify_users_name,
        isLastSuccess
    });


    mapConfig = config => ({
        id: config.id,
        type: config.type,
        author: config.author,
        comment: config.comment,
        notify: config.notify_users_name,
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
        type: 'template',
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
                const type = _.get(node, 'type', '').toLowerCase();
                return (
                    <ReportCell
                        formatIcon={type && `icon-${type}`}
                        iconTitle={type && type.toUpperCase()}
                        text={node[column.name]}
                        disabled={node.state === 'FAILED'}
                        href={node.path}
                    />
                );
            case 'notify': {
                return (
                    <DefaultCell
                        content={node[column.name] ? node[column.name].join(', ') : ''}
                    />
                );
            }
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
            case 'start':
            case 'end': {
                return <DefaultCell
                    content={node[column.name] ? moment(node[column.name]).format(DATE_TIME) : ''}
                />;
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
            case 'type': {
                return <DefaultCell
                    content={ls(`REPORT_TYPE_${node[column.name]}`, '')}
                />
            }
            default: {
                return <DefaultCell
                    content={node[column.name]}
                />;
            }
        }
    };

    render() {
        const mappedData = this.mapData(this.props);

        return (
            <TreeView
                data={mappedData}
                columns={ReportsTable.getColumns()}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
            />
        );
    }
}

export default ReportsTable;
