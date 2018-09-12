import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import cn from 'classnames';

class DrilldownBodyCell extends React.PureComponent {
    static propTypes = {
        column: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        row: PropTypes.shape({
            name: PropTypes.string.isRequired,
            parameter: PropTypes.string.isRequired,
            index: PropTypes.string.isRequired,
            ksub: PropTypes.string.isRequired,
            khe: PropTypes.string.isRequired,
            knet: PropTypes.string.isRequired,
        }).isRequired,
        expanded: PropTypes.instanceOf(Set).isRequired,
        onExpanderClick: PropTypes.func.isRequired,
    };

    onClick = () => {
        this.props.onExpanderClick(this.props.row.id);
    };

    renderName(column, row, isExpanded) {
        const hasItems = Array.isArray(row.items) && row.items.length !== 0;

        return (
            <div className={cn(styles.cell, styles.name, { [styles.expanded]: isExpanded })}>
                {hasItems && (
                    <svg
                        className={styles.expander}
                        viewBox="0 0 16 16"
                        onClick={this.onClick}
                    >
                        <path d="M4,8l8,0z"/>
                        <path d="M8,4l0,8z" className={styles.vertical}/>
                    </svg>
                )}
                <div className={styles.parentCell}>
                    {row.name}
                </div>
                {isExpanded && (row.items.map(childRow => (
                    <div
                        key={childRow.id}
                        className={styles.childCell}
                    >
                        {childRow.name}
                    </div>
                )))}
            </div>
        );
    }

    formatValue = number => typeof number === 'number'
        ? parseFloat(number.toFixed(2)) + '%'
        : ls('NOT_AVAILABLE', 'Н/Д');


    isLower = (row, fieldName, parentTarget) => {
        const { target = parentTarget } = row;
        const { [fieldName]: current = 0 } = row;
        return current <= target;
    };

    renderValue = (column, row, isExpanded, fieldName) => {
        return (
            <div className={cn(styles.cell, styles.itv1)}>
                <div className={cn(styles.parentCell, {
                    [styles.lowerThanTarget]: this.isLower(row, fieldName),
                })}>{this.formatValue(row[fieldName])}</div>
                {isExpanded && (row.items.map(childRow => (
                    <div
                        key={childRow.id}
                        className={cn(styles.childCell, {
                            [styles.lowerThanTarget]: this.isLower(childRow, fieldName, row.target),
                        })}
                    >
                        {this.formatValue(childRow[fieldName])}
                    </div>
                )))}
            </div>
        );
    }

    render() {
        const { column, row, expanded } = this.props;
        const isExpanded = expanded.has(row.id);

        switch (column.name) {
            case 'name':
                return this.renderName(column, row, isExpanded);
            case 'ksub':
            case 'khe':
            case 'knet':
                return this.renderValue(column, row, isExpanded, column.name);
            default:
                return null;
        }
    }
}

export default DrilldownBodyCell;
