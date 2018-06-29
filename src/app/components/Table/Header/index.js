import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import memoize from 'memoizejs';
import styles from '../styles.scss';
import HeaderCell from '../HeaderCell';
import Resizer from '../Resizer';

const MIN_COLUMN_WIDTH = 30;

class Header extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        columns: PropTypes.array,
        columnsWidths: PropTypes.object,
        sortInfo: PropTypes.object,
        headerRowRender: PropTypes.func,
        onColumnFilterChange: PropTypes.func,
        onHeaderCellClick: PropTypes.func,
    };

    static defaultProps = {
        columns: [],
        columnsWidths: null,
        sortInfo: null,
        headerRowRender: () => null,
        onColumnFilterChange: () => null,
        onHeaderCellClick: () => null,
    };

    static pickReservedWidths(columns) {
        return columns.reduce((result, { width }) => width ? result.concat(width) : result, []);
    };

    static prepareColumns(columns) {
        const reservedWidths = Header.pickReservedWidths(columns);

        return columns.map((column) => {
            const reservedWidth = reservedWidths.reduce((sum, value) => sum + value, 0);

            return {
                name: column.name,
                width: column.width ? column.width : `calc(((100% - ${reservedWidth}px) / ${columns.length - reservedWidths.length})`,
                maxWidth: column.maxWidth,
                minWidth: column.minWidth || MIN_COLUMN_WIDTH,
                resizable: column.resizable,
            };
        });
    }

    static getColumnsStyles = (tableId, columns, lastResized) =>
        columns.reduce((styles, column) => {
            const { width, maxWidth, minWidth, lastWidthChange } = column;
            const lastResizedWidth = lastResized[column.name];

            return [
                ...styles,
                `.table-${tableId}_column-${column.name} {
                    width: ${typeof width == 'number' ? `${width + lastResizedWidth}px` : `${width} + ${lastResizedWidth}px)`};
                    min-width: ${minWidth || MIN_COLUMN_WIDTH}px;
                    ${maxWidth ? `max-width: ${maxWidth}px;`: ''} 
                }`
            ];
        }, []);

    static resize(columns, columnName, lastResized, modifier) {
        const columnIndex = columns.findIndex(col => col.name === columnName);
        if (columnIndex === -1 || modifier === 0) return lastResized;

        const column = columns[columnIndex];
        let nextColumn = _.find(columns.slice(columnIndex + 1), col => !!col.resizable);
        nextColumn = nextColumn || _.findLast(columns.slice(0, columnIndex), col => !!col.resizable);

        return {
            ...lastResized,
            ...Header.resizeColumn(column, lastResized[column.name], modifier),
            ...(nextColumn ? Header.resizeColumn(nextColumn, lastResized[nextColumn.name], -modifier) : null),
        };
    }

    static resizeColumn(columnConfig, prevModifier, modifier) {
        const { name, width, maxWidth, minWidth } = columnConfig;
        let finalModifier;

        if (typeof width === 'number') {
            if (modifier > 0) {
                finalModifier = maxWidth < (width + prevModifier + modifier) ? maxWidth - width : prevModifier + modifier;
            } else {
                finalModifier = minWidth > (width + prevModifier + modifier) ? minWidth - width : prevModifier + modifier;
            }
        } else {
            finalModifier = prevModifier + modifier;
        }

        return {
            [name]: finalModifier,
        };
    }

    constructor(props) {
        super(props);

        this.columns = Header.prepareColumns(props.columns);
        this.state = {
            lastResized: props.columns.reduce((result, column) => ({
                ...result,
                [column.name]: 0,
            }), {}),
        };
    };

    resizeColumnEnd = (columnName, width) => {
        const lastResized = Header.resize(this.columns, columnName, this.state.lastResized, width);

        this.setState({ lastResized });
    }

    render() {
        const {
            id,
            columns,
            sortInfo,
            headerRowRender,
            onColumnFilterChange,
            onHeaderCellClick,
        } = this.props;
        const { lastResized } = this.state;
        const columnStyles = Header.getColumnsStyles(id, this.columns, this.state.lastResized);

        return (
            <Fragment>
                <div className={styles.tableHeader}>
                    {columns.map((column, index) => (
                        <HeaderCell
                            className={`table-${id}_column-${column.name}`}
                            key={column.name}
                            filterable={!!column.filter}
                            onClick={() => onHeaderCellClick(column)}
                            onColumnFilterChange={values => onColumnFilterChange(column.name, values)}
                        >
                            {headerRowRender(column, sortInfo)}
                            {column.resizable && (index !== columns.length -1) && (
                                <Resizer
                                    onResizeEnd={x => this.resizeColumnEnd(column.name, x)}
                                />
                            )}
                        </HeaderCell>
                    ))}
                </div>
                <style>{columnStyles}</style>
            </Fragment>
        );
    }
}

export default Header;
