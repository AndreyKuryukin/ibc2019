import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import memoize from 'memoizejs';
import search from '../../../../../util/search';
import Table from '../../../../../components/Table';
import { DefaultCell, LinkCell } from '../../../../../components/Table/Cells';
import ls from "i18n";
import { createSelector } from "reselect";
import { DATE_TIME } from "../../../../../costants/date";
import moment from "moment";

const priorityMap = {
    'CRITICAL': ls('KQI_HISTORY_PRIORITY_CRITICAL', 'Критичный'),
    'MAJOR': ls('KQI_HISTORY_PRIORITY_MAJOR', 'Высокий'),
    'NORMAL': ls('KQI_HISTORY_PRIORITY_NORMAL', 'Нормальный'),
    'MINOR': ls('KQI_HISTORY_PRIORITY_CRITICAL', 'Низкий'),
};

const periodMap = {
    'DAY': ls('KQI_HISTORY_PERIOD_DAY', 'Ежесуточный'),
    'WEEK': ls('KQI_HISTORY_PERIOD_DAY', 'Еженедельный'),
    'MONTH': ls('KQI_HISTORY_PERIOD_DAY', 'Ежемесячный'),
};

class KqiTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        checked: [],
        searchText: '',
        preloader: false,
        onCheck: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    mapDataFromProps = createSelector(
        props => props.data,
        data => data.map((element) => ({
            id: element.id,
            priority: priorityMap[String(element.priority).toUpperCase()],
            raise_time: moment(element.raise_time).format(DATE_TIME),
            policy_name: element.policy_name,
            period: periodMap[String(element.period).toUpperCase()]
        })),
    );

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ data: this.mapDataFromProps(nextProps) })
        }
    }

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.props.checked, node.id] : _.without(this.props.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.props.onCheck(checked);
    };

    static getColumns = memoize(() => ([
        {
            title: ls('KQI_HISTORY_COLUMN_ID_TITLE', 'ID'),
            name: 'id',
            searchable: true,
            sortable: true,
            filter: {
                type: 'number',
            },
        },
        {
            title: ls('KQI_HISTORY_COLUMN_ID_PRIORITY', 'Приоритет'),
            name: 'priority',
            searchable: true,
            sortable: true,
            filter: {
                type: 'text',
            },
        },
        {
            title: ls('KQI_HISTORY_COLUMN_ID_RAISE_TIME', 'Время возникновения'),
            name: 'raise_time',
            searchable: true,
            sortable: true,
            filter: {
                type: 'text',
            },
        },
        {
            title: ls('KQI_HISTORY_COLUMN_ID_POLICY_NAME', 'Название политики по каталогу'),
            name: 'policy_name',
            searchable: true,
            sortable: true,
            filter: {
                type: 'text',
            },
        },
        {
            title: ls('KQI_HISTORY_COLUMN_ID_PERIOD', 'Периодичность вычисления'),
            name: 'period',
            searchable: true,
            sortable: true,
            filter: {
                type: 'text',
            },
        },
    ]));

    headerRowRender = (column, sort) => {
        const sortDirection = sort.by === column.name ? sort.direction : null;
        return (
            <DefaultCell
                content={column.title}
                sortDirection={sortDirection}
            />
        );
    };

    bodyRowRender = (column, node) => {
        const text = node[column.name];
        switch (column.name) {
            case 'id':
                return (
                    <LinkCell
                        href={`/alarms/kqi/history/${node.id}`}
                        content={text}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={text}
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
        const { searchText, preloader } = this.props;
        const { data } = this.state;
        console.log(data, searchText);

        const columns = KqiTable.getColumns();
        const resultData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <Table headerRowRender={this.headerRowRender}
                   bodyRowRender={this.bodyRowRender}
                   data={resultData}
                   columns={columns}
                   preloader={preloader}
            />
        );
    }
}

export default KqiTable;
