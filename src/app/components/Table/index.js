import React from 'react';
import PropTypes from 'prop-types';
import { Table as ReactstrapTable } from 'reactstrap';
import _ from 'lodash';
import styles from './styles.scss';
import { naturalSort } from '../../util/sort';
import HeaderCell from './HeaderCell';
import Immutable from 'immutable';
import classnames from "classnames";
import search from '../../util/search';

class Table extends React.Component {
    static childContextTypes = {
        sort: PropTypes.func,
    }

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        className: PropTypes.string,
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        customSortFunction: PropTypes.func,
        selectable: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        columns: [],
        className: '',
        selectable: false,
        headerRowRender: null,
        bodyRowRender: () => null,
        customSortFunction: null,
    };

    static getDefaultSortBy(columns) {
        const defaultSortColumn = columns.find(column => column.sortable);

        return defaultSortColumn ? defaultSortColumn.name : null;
    }

    constructor(props) {
        super(props);

        const defaultSortDirection = 'asc';
        const sortBy = Table.getDefaultSortBy(props.columns);

        this.state = {
            data: sortBy ? naturalSort(props.data, [defaultSortDirection], node => [_.get(node, `${sortBy}`, '')]) : props.data,
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

    componentDidMount() {
        if (this.props.selectable) {
            this.addListeners()
        }
    }

    componentWillUnmount() {
        if (this.props.selectable) {
            this.removeListeners()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({
                data: nextProps.data,
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

    onKeyDownListener = (event) => {
        if (event.which === "17")
            this.setState({ cntrlIsPressed: true });
    };

    onKeyUpListener = (event) => {
        if (event.which === "17")
            this.setState({ cntrlIsPressed: false });
    };

    addListeners = () => {
        document.addEventListener('keydown', this.onKeyDownListener);
        document.addEventListener('keyup', this.onKeyUpListener);
    };

    removeListeners = () => {
        document.removeEventListener('keydown', this.onKeyDownListener);
        document.removeEventListener('keyup', this.onKeyUpListener);
    };

    onRowClick = (node) => {
        // if (this.state.cntrlIsPressed) {
        this.setState({ selected: node.id });
        // }
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
        const { columns, headerRowRender, bodyRowRender, className, customSortFunction, ...rest } = this.props;
        const { data = [], selected, sort } = this.state;
        return (
            <div className={styles.tableContainer} style={{
                backgroundPositionY: headerRowRender ? `${this.getHeadHeight()}px` : 0,
            }}>
                <ReactstrapTable striped bordered {...rest} className={classnames('table-hover', className)}>
                    {headerRowRender && <thead
                        ref={thead => (this.thead = thead)}
                    >
                        <tr>
                            {columns.map(column => (
                                <HeaderCell
                                    key={column.name}
                                    filterable={!!column.filter}
                                    headerRowRender={() => headerRowRender(column, sort)}
                                    onClick={() => this.onHeaderCellClick(column)}
                                    onColumnFilterChange={(values) => this.onColumnFilterChange(column.name, values)}
                                    width={column.width}
                                >
                                    {headerRowRender(column, sort)}
                                </HeaderCell>
                            ))}
                        </tr>
                    </thead>}
                    <tbody>
                    {data.map(node => (
                        <tr key={node.id}
                            onClick={() => this.onRowClick(node)}
                            className={classnames({ [styles.selected]: selected === node.id })}
                        >
                            {columns.map(column => (
                                <td
                                    key={column.name}
                                    style={{
                                        width: column.width,
                                        maxWidth: column.width,
                                    }}
                                >
                                    {bodyRowRender(column, node)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </ReactstrapTable>
            </div>
        );
    }
}

export default Table;
