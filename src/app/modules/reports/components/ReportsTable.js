import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import { createSelector } from 'reselect';

import TreeView from '../../../components/TreeView';
import { DefaultCell, IconCell } from '../../../components/Table/Cells';
import search from '../../../util/search';
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
        sortable: true,
        searchable: true,
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
        name: config.config_name,
        children: config.reports.map(this.mapReport),
    });

    mapTemplate = template => ({
        id: template.templ_id,
        name: template.templ_name,
        children: template.report_config.map(this.mapConfig),
    });

    mapData = createSelector(
        props => props.data,
        data => data.map(this.mapTemplate)
    );

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch(column.name) {
            case 'name':
                return (
                    <ReportCell
                        formatIcon="addIcon"
                        rebuildIcon="addIcon"
                        isFormatIconHidden={node.expandable}
                        isRebuildIconHidden={node.expandable}
                        text={node[column.name]}
                    />
                );
            case 'notify':
                return (
                    <DefaultCell
                        content={node[column.name] ? node[column.name].join(', ') : ''}
                    />
                );
            case 'delete':
                return (
                    <IconCell
                        icon="deleteIcon"
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

    render() {
        const mappedData = this.mapData(this.props);

        return (
            <TreeView
                data={mappedData}
                columns={this.getColumns()}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default ReportsTable;
