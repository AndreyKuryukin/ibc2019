import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import moment from 'moment';
import { createSelector } from 'reselect';
import memoize from 'memoizejs';
import search from '../../../util/search';
import TreeView from '../../../components/TreeView';
import { DefaultCell, IconCell, LinkCell } from '../../../components/Table/Cells';
import styles from './styles.scss';
import { DATE, DATE_TIME } from '../../../costants/date';
import _ from "lodash";
import Table from "../../../components/Table/index";

const NODE_TYPES = {
    PROJECTION: 'projection',
    RESULT: 'result',
};

export class ProjectionsTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        configId: PropTypes.string,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        configId: null,
    };

    static getColumns = memoize(() => [{
        title: ls('KQI_PROJECTIONS_COLUMN_TITLE', 'Проекции'),
        name: 'name',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_CREATED_COLUMN_TITLE', 'Дата создания'),
        name: 'creation_date',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_AUTHOR_COLUMN_TITLE', 'Автор'),
        name: 'author',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_COUNT_COLUMN_TITLE', 'Количество'),
        name: 'count',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_LAST_DATE_COLUMN_TITLE', 'Дата последнего вычисления'),
        name: 'last_calc_date',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_STATUS_COLUMN_TITLE', 'Статус последнего вычисления'),
        name: 'status',
    }, {
        title: ls('KQI_AUTOCOUNT_COLUMN_TITLE', 'Автовычисление'),
        name: 'auto',
        width: 110,
    }, {
        title: ls('KQI_GRAPH_COLUMN_TITLE', 'График'),
        name: 'graph',
        width: 60,
    }, {
        title: '',
        name: 'edit',
        width: 40,
    }, {
        title: '',
        name: 'delete',
        width: 25,
    }]);


    mapProjection = projection => ({
        id: projection.id,
        name: projection.name,
        creation_date: projection.creation_date,
        author: projection.author,
        count: String(projection.count),
        last_calc_date: projection.last_calc_date,
        result_id: projection.result_id,
        status: projection.status,
        auto: _.get(projection, 'auto', false),
        type: NODE_TYPES.PROJECTION,
    });

    getMappedDataFromProps = createSelector(
        (props) => props.data,
        data => data.map(this.mapProjection)
    );

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch (column.name) {
            case 'name':
                if (node.type === NODE_TYPES.PROJECTION && node.result_id) {
                    const href = `/kqi/view/${this.props.configId}/${node.id}/${node.result_id}`;
                    return (
                        <LinkCell
                            href={href}
                            content={node[column.name]}
                        />
                    );
                }
                return <DefaultCell
                    content={node[column.name]}
                />;
            case 'auto':
                return (
                    node[column.name] && <div className={styles.autoCount}>✔</div>
                );
            case 'edit':
                return (
                    <IconCell
                        icon="edit-icon"
                        onIconClick={() => null}
                    />
                );
            case 'delete':
                return (
                    <div
                        className={styles.deleteStyle}
                        onClick={() => null}
                    >
                        ×
                    </div>
                );
            case 'creation_date':
            case 'last_calc_date':
                return (
                    <DefaultCell
                        content={node[column.name] ? moment(node[column.name]).format(DATE_TIME) : ''}
                    />
                );
            case 'graph':
                return (
                    <IconCell
                        icon="graph-icon"
                        onClick={() => null}
                    />
                );
            case 'status':
                return (
                    <IconCell
                        cellStyle={{justifyContent: 'center'}}
                        icon={`icon-state-${node.status.toLowerCase()}`}
                        iconProps={{ title: ls(`KQI_STATUS_${node.status.toUpperCase()}`) }}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={node[column.name] || ''}
                    />
                );
        }
    };

    filter = (data, searchableColumns, searchText) =>
        data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText))
        );

    render() {
        const { searchText } = this.props;
        const mappedData = this.getMappedDataFromProps(this.props);
        const columns = ProjectionsTable.getColumns();
        const filteredData = searchText ? this.filter(mappedData, columns.filter(col => col.searchable), searchText) : mappedData;

        return (
            <Table
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
            />
        );
    }
}

export default ProjectionsTable;
