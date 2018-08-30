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
        rowClassGetter: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        columns: null,
        columnsWidths: null,
        selected: '',
        onRowClick: () => null,
        bodyRowRender: () => null,
        rowClassGetter: () => null,
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
            rowClassGetter,
        } = this.props;

        return (
            <div className={styles.tableBody}>
                {data.map((node, index) => {
                    const rowClass = _.isFunction(rowClassGetter) ? rowClassGetter(node) : '';
                    return (
                        <div
                            key={node.id || `table-${id}_node-${index}`}
                            id={node.id}
                            className={classnames(styles.bodyRow, rowClass, { [styles.selected]: selected === node.id })}
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
                    );
                })}
            </div>
        );
    }
}

export default Body;
