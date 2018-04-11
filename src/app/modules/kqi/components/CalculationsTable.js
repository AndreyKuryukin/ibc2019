import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import moment from 'moment';
import search from '../../../util/search';
import TreeView from '../../../components/TreeView';
import { DefaultCell, LinkCell } from '../../../components/Table/Cells';
import styles from './styles.scss';
import { DATE_TIME } from '../../../costants/date';

const mock = [{
    id: 1,
    projections: 'МРФ_Волга_по_РФ',
    created: '2018-04-09T13:15:34.066',
    author: 'User 1',
    count: '1',
    last_calc_date: '2018-04-09T13:15:34.066',
    status: 'LOADING',
    autocount: true,
    children: [{
        id: 2,
        projections: 'МРФ_Волга_по_РФ',
        created: '2018-04-09T13:15:34.066',
        author: 'User 1',
        count: '1',
        last_calc_date: '2018-04-09T13:15:34.066',
        status: 'LOADING',
        autocount: false,
    }],
}];

export class CalculationsTable extends React.PureComponent {
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
        title: ls('KQI_PROJECTIONS_COLUMN_TITLE', 'Проекции Krc'),
        name: 'projections',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_CREATED_COLUMN_TITLE', 'Дата создания'),
        name: 'created',
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
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_AUTOCOUNT_COLUMN_TITLE', 'Автовычисление'),
        name: 'autocount',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_GRAPH_COLUMN_TITLE', 'График'),
        name: 'graph',
        searchable: true,
        sortable: true,
    }, {
        title: '',
        name: 'edit',
        width: 25,
    }, {
        title: '',
        name: 'delete',
        width: 25,
    }];

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch(column.name) {
            case 'projections':
                return (
                    <LinkCell
                        href={`/kqi/view/${node.id}`}
                        content={node[column.name]}
                    />
                );
            case 'autocount':
                return (
                    node[column.name] && <div className={styles.autoCount}>✔</div>
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
            case 'created':
            case 'last_calc_date':
                return (
                    <DefaultCell
                        content={moment(node[column.name]).format(DATE_TIME)}
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

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    render() {
        const { data, searchText } = this.props;
        const columns = this.getColumns();
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;

        return (
            <TreeView
                data={mock}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
            />
        );
    }
}

export default CalculationsTable;
