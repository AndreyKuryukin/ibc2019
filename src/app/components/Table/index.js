import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Immutable from 'immutable';
import classnames from 'classnames';
import memoize from 'memoizejs';
import Preloader from '../Preloader';
import { naturalSort } from '../../util/sort';
import search from '../../util/search';
import styles from './styles.scss';
import HeaderCell from './HeaderCell';

const SCROLL_WIDTH = 0;

class Table extends React.Component {
    static childContextTypes = {
        sort: PropTypes.func,
    };

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        className: PropTypes.string,
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        customSortFunction: PropTypes.func,
        onSelectRow: PropTypes.func,
        preloader: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        columns: [],
        className: '',
        preloader: false,
        headerRowRender: null,
        bodyRowRender: () => null,
        customSortFunction: null,
        onSelectRow: null,
    };

    static getDefaultSortBy(columns) {
        const defaultSortColumn = columns.find(column => column.sortable);

        return defaultSortColumn ? defaultSortColumn.name : null;
    };

    static pickReservedWidths(columns) {
        return columns.reduce((result, { width }) => width ? result.concat(width) : result, []);
    };

    static computeColumnsWidths = memoize((columns) => {
        const reservedWidths = Table.pickReservedWidths(columns);

        return columns.reduce((widths, { name, width }) => {
            const reservedWidth = reservedWidths.reduce((result, value) => result + value, 0);

            return {
                ...widths,
                [name]: {
                    header: width || `calc((100% - ${reservedWidth + SCROLL_WIDTH}px) / ${columns.length - reservedWidths.length})`,
                    body: width || `calc((100% - ${reservedWidth}px) / ${columns.length - reservedWidths.length})`,
                },
            };
        }, {});
    });

    constructor(props) {
        super(props);

        const defaultSortDirection = 'asc';
        const sortBy = Table.getDefaultSortBy(props.columns);
        const data = Array.isArray(props.data) ? props.data : [];

        this.state = {
            data: sortBy ? naturalSort(data, [defaultSortDirection], node => [_.get(node, `${sortBy}`, '')]) : data,
            cntrlIsPressed: false,
            selected: [],
            sort: {
                by: sortBy,
                direction: defaultSortDirection,
            },
            columnFilterValues: Immutable.Map(),
        }
    }

    getChildContext() {
        return {
            sort: this.sort,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({
                data: Array.isArray(nextProps.data) ? nextProps.data : [],
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const isColumnFilterValuesChanged = this.state.columnFilterValues !== nextState.columnFilterValues;
        return !isColumnFilterValuesChanged;
    }

    getHeadHeight() {
        return this.thead ? this.thead.getBoundingClientRect().height : 22;
    }

    onRowClick = (node) => {
        this.setState({ selected: node.id });
        if (typeof this.props.onSelectRow === 'function') {
            this.props.onSelectRow(node.id);
        }
    };

    sort = (columnName) => {
        const { by, direction } = this.state.sort;
        const nextDirection = (direction === 'asc' && by === columnName) ? 'desc' : 'asc';

        const sortedData = this.props.customSortFunction
            ? this.props.customSortFunction(columnName, nextDirection)
            : naturalSort(this.state.data, [nextDirection], node => [_.get(node, `${columnName}`)]);

        this.setState({
            sort: {
                by: columnName,
                direction: nextDirection,
            },
            data: sortedData,
        });
    };

    onHeaderCellClick = (column) => {
        if (column.sortable) {
            this.sort(column.name);
        }
    };

    onColumnFilterChange = (columnName, filterValues) => {
        let columnFilterValues = this.state.columnFilterValues.set(columnName, filterValues.toArray().filter(v => !!v));

        if (columnFilterValues.get(columnName).length === 0) {
            columnFilterValues = columnFilterValues.delete(columnName);
        }

        const searchByColumns = (node) => {
            if (columnFilterValues.size === 0) return true;

            return columnFilterValues.entrySeq().reduce((result, [key, values]) =>
                result && values.reduce((columnResult, nextValue) => columnResult || search(node[key], nextValue), false),
                true);
        };

        this.setState({
            columnFilterValues,
        }, () => {
            this.setState({ data: this.props.data.filter(searchByColumns) });
        });
    };

    render() {
        const {
            columns,
            headerRowRender,
            bodyRowRender,
            className,
            preloader,
        } = this.props;
        const { data = [], selected, sort } = this.state;
        const columnsWidths = Table.computeColumnsWidths(columns);

        return (
            <Preloader active={preloader}>
                <div className={classnames(styles.tableContainer, className )}>
                    {headerRowRender && <div className={styles.tableHeader}>
                        {columns.map((column, index) => (
                            <HeaderCell
                                key={column.name}
                                filterable={!!column.filter}
                                onClick={() => this.onHeaderCellClick(column)}
                                onColumnFilterChange={(values) => this.onColumnFilterChange(column.name, values)}
                                width={_.get(columnsWidths, `${[column.name]}.header`, 0)}
                            >
                                {headerRowRender(column, sort)}
                            </HeaderCell>
                        ))}
                    </div>}
                    <div className={styles.tableBody}>
                        {data.map(node => (
                            <div
                                key={node.id}
                                className={classnames(styles.bodyRow, { [styles.selected]: selected === node.id })}
                                onClick={() => this.onRowClick(node)}
                            >
                                {columns.map((column) => (
                                    <div
                                        key={column.name}
                                        className={styles.bodyCell}
                                        style={{
                                            width: _.get(columnsWidths, `${[column.name]}.body`, 0),
                                            minWidth: _.get(columnsWidths, `${[column.name]}.body`, 0)
                                        }}
                                    >
                                        {bodyRowRender(column, node)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Preloader>
        );
    }
}

export default Table;
