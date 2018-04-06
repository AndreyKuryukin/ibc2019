import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import { createSelector } from 'reselect';
import TreeView from '../../../components/TreeView';
import { DefaultCell, IconCell } from '../../../components/Table/Cells';
import styles from './styles.scss';
import ReportCell from './ReportCell';

class ReportsTable extends React.PureComponent {
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
        title: ls('REPORTS_NAME_COLUMN_TITLE', 'Название отчёта'),
        name: 'name',
        sortable: true,
        searchable: true,
    }, {
        title: ls('REPORTS_CREATED_COLUMN_TITLE', 'Создан'),
        name: 'created',
        sortable: true,
        searchable: true,
    }, {
        title: ls('REPORTS_STATE_COLUMN_TITLE', 'Состояние'),
        name: 'state',
        sortable: true,
        searchable: true,
        width: 75
    }, {
        title: ls('REPORTS_FORMAT_COLUMN_TITLE', 'Формат'),
        name: 'format',
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
    }, {
        title: '',
        name: 'delete',
        width: 25
    }];

    mapReport = report => ({
        id: report.id,
        name: report.file_name,
        path: report.file_path,
        start: report.create_start,
        end: report.create_end,
        state: report.state,
        type: report.type,
        author: report.author,
        comment: report.comment,
        notify: report.notify_users_name,
    });

    mapConfig = config => ({
        id: config.config_id,
        type: 'config',
        name: config.config_name,
        children: _.get(config, 'reports', []).map(this.mapReport),
    });

    mapTemplate = template => ({
        id: template.templ_id,
        type: 'template',
        name: template.templ_name,
        children: _.get(template, 'report_config', []).map(this.mapConfig),
    });

    mapGroups = group => ({
        id: group.id,
        name: group.name,
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
                this.props.removeResult(node.id, _.last(node.parents))
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
            case 'notify':
                return (
                    <DefaultCell
                        content={node[column.name] ? node[column.name].join(', ') : ''}
                    />
                );
            case 'state':
                const state = _.get(node, 'state', '').toLowerCase();
                return <IconCell
                    icon={`icon-state-${state}`}
                    iconProps={{
                        title: ls(`REPORTS_STATUS_${state.toUpperCase()}`, 'Статус')
                    }}
                    cellStyle={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                />;
            case 'delete':
                return (node.type === 'PDF' || node.type === 'XLS') &&
                    <div className={styles.deleteStyle} onClick={() => this.remove(node)}>×</div>;
            default:
                return !node.type ? <DefaultCell
                    content={node[column.name]}
                /> : '';
        }
    };

    render() {
        const mappedData = this.mapData(this.props);

        return (
            <TreeView
                data={mappedData}
                columns={this.getColumns()}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
            />
        );
    }
}

export default ReportsTable;
