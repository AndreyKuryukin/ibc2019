import React from 'react';
import PropTypes from 'prop-types';
import styles from './row.scss';
import cn from 'classnames';

class Row extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        columns: PropTypes.arrayOf(PropTypes.string).isRequired,
        data: PropTypes.object.isRequired,
        children: PropTypes.node,
        collapsed: PropTypes.bool,
        onCollapse: PropTypes.func,
        cellRenderer: PropTypes.func,
        onClick: PropTypes.func,
    };
    static defaultProps = {
        collapsed: true,
    };

    onCollapse = () => {
        if (typeof this.props.onCollapse === 'function') {
            this.props.onCollapse(this.props.data.id);
        }
    };
    onClick = () => {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(this.props.data);
        }
    };

    renderCell(columnKey) {
        const value = this.props.data[columnKey];

        if (typeof this.props.cellRenderer === 'function') {
            const cell = this.props.cellRenderer(value, this.props.data, columnKey);
            if (cell !== undefined) return cell;
        }

        return value;
    }

    render() {
        const {className, columns, children, collapsed} = this.props;
        const hasChildren = children !== undefined && children !== null;

        return (
            <div
                className={cn(styles.treeViewTableBodyRow, className, {
                    [styles.collapsible]: hasChildren,
                    [styles.uncollapsed]: !collapsed,
                    [styles.clickable]: typeof this.props.onClick === 'function',
                })}
                onClick={this.onClick}
            >
                <div
                    className={styles.cells}
                    onClick={hasChildren ? this.onCollapse : undefined}
                >
                    {columns.map(columnKey => (
                        <div
                            key={columnKey}
                            className={styles.cell}
                            data-column={columnKey}
                        >{this.renderCell(columnKey)}</div>
                    ))}
                </div>
                {hasChildren && !collapsed && <div className={styles.children}>{children}</div>}
            </div>
        );
    }
}

export default Row;
