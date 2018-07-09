import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import styles from '../styles.scss';

class Body extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        data: PropTypes.array,
        columns: PropTypes.array,
        columnsWidths: PropTypes.object,
        selected: PropTypes.string,
        onRowClick: PropTypes.func,
        bodyRowRender: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        columns: null,
        columnsWidths: null,
        selected: '',
        onRowClick: () => null,
        bodyRowRender: () => null,
    };

    render() {
        const {
            id,
            data,
            columns,
            columnsWidths,
            selected,
            onRowClick,
            bodyRowRender,
        } = this.props;

        return (
            <div className={styles.tableBody}>
                {data.map((node, index) => <div
                        key={node.id || `table-${id}_node-${index}`}
                        id={node.id}
                        className={classnames(styles.bodyRow, { [styles.selected]: selected === node.id })}
                        onClick={() => onRowClick(node)}
                    >
                        {columns.map(column => (
                            <div
                                key={column.name}
                                className={classnames(styles.bodyCell, `table-${id}_column-${column.name}`)}
                            >
                                {bodyRowRender(column, node)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default Body;
