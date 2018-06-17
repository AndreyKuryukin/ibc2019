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
            itv1: PropTypes.string.isRequired,
            itv2: PropTypes.string.isRequired,
        }).isRequired,
        expanded: PropTypes.instanceOf(Set).isRequired,
    };

    renderName(column, row, isExpanded) {
        return (
            <div className={cn(styles.cell, styles.name)}>
                <div className={styles.parentCell}>
                    {row.parameter}<sub>{row.index}</sub>
                </div>
                {isExpanded && (row.items.map(childRow => (
                    <div
                        key={childRow.id}
                        className={styles.childCell}
                    >
                        {row.parameter}<sub>{row.index}</sub> {childRow.name}
                    </div>
                )))}
            </div>
        );
    }
    renderITV1(column, row, isExpanded) {
        return (
            <div className={cn(styles.cell, styles.itv1)}>
                <div className={styles.parentCell}>{row.itv1}</div>
                {isExpanded && (row.items.map(childRow => (
                    <div
                        key={childRow.id}
                        className={styles.childCell}
                    >
                        {childRow.itv1}
                    </div>
                )))}
            </div>
        );
    }
    renderITV2(column, row, isExpanded) {
        return (
            <div className={cn(styles.cell, styles.itv2)}>
                <div className={styles.parentCell}>{row.itv2}</div>
                {isExpanded && (row.items.map(childRow => (
                    <div
                        key={childRow.id}
                        className={styles.childCell}
                    >
                        {childRow.itv2}
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
            case 'itv1':
                return this.renderITV1(column, row, isExpanded);
            case 'itv2':
                return this.renderITV2(column, row, isExpanded);
            default:
                return null;
        }
    }
}

export default DrilldownBodyCell;
