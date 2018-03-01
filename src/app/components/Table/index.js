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

class Table extends React.PureComponent {
    static childContextTypes = {
        sort: PropTypes.func,
    }

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        selectable: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        columns: [],
        selectable: false,
        headerRowRender: () => null,
        bodyRowRender: () => null,
    };

    static getDefaultSortBy(columns) {
        const defaultSortColumn = columns.find(column => column.sortable);

        return defaultSortColumn ? defaultSortColumn.name : null;
    }

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            cntrlIsPressed: false,
            selected: [],
            sort: {
                by: Table.getDefaultSortBy(props.columns),
                direction: 'asc',
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
            this.setState({ selected:  node.id });
        // }
    }

    sort = (columnName) => {
        const { by, direction } = this.state.sort;
        const nextDirection = (direction === 'asc' && by === columnName) ? 'desc' : 'asc';

        const sortedData = naturalSort(this.state.data, [nextDirection], node => [_.get(node, `${columnName}`)]);

        this.setState({
            sort: {
                by: columnName,
                direction: nextDirection,
            },
            data: sortedData,
        });
    }

    onHeaderCellClick = (column) => {
        if (column.sortable) {
            this.sort(column.name);
        }
    }

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
    }

    render() {
        const { columns, headerRowRender, bodyRowRender, selectable, ...rest } = this.props;
        const { data = [], selected, sort } = this.state;
        return (
            <ReactstrapTable striped bordered {...rest} className="table-hover">
                <thead>

                    {columns.map(column => {

                        return (
                            <HeaderCell
                                key={column.name}
                                filterable={!!column.filter}
                                headerRowRender={() => headerRowRender(column, sort)}
                                onClick={() => this.onHeaderCellClick(column)}
                                onColumnFilterChange={(values) => this.onColumnFilterChange(column.name, values)}
                            >
                                    {headerRowRender(column, sort)}
                                </HeaderCell>
                        );
                    })}

                </thead>
                <tbody>
                {data.map(node => (
                    <tr key={node.id}
                        onClick={() => this.onRowClick(node)}
                        className={classnames({[styles.selected]: selected === node.id }) }
                    >
                        {columns.map(column => (
                            <td key={column.name}>
                                {bodyRowRender(column, node)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </ReactstrapTable>
        );
    }
}

export default Table;
