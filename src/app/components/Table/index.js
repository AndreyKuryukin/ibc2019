import React from 'react';
import PropTypes from 'prop-types';
import { Table as ReactstrapTable } from 'reactstrap';

import styles from './styles.scss';

class Table extends React.PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        columns: [],
        headerRowRender: () => null,
        bodyRowRender: () => null,
    };

    render() {
        const { data, columns, headerRowRender, bodyRowRender, ...rest } = this.props;

        return (
            <ReactstrapTable striped {...rest}>
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th className={styles.thFix} key={column.name}>{headerRowRender(column)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(node => (
                        <tr key={node.id}>
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
