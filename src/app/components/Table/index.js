import React from 'react';
import PropTypes from 'prop-types';
import { Table as ReactstrapTable } from 'reactstrap';

class Table extends React.PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
    }

    static defaultProps = {
        data: [],
        columns: [],
        headerRowRender: () => null,
        bodyRowRender: () => null,
    };

    render() {
        const { data, columns, headerRowRender, bodyRowRender } = this.props;

        return (
            <ReactstrapTable striped>
                <thead>
                    <tr>
                        {columns.map(column => (
                            <td key={column.name}>{headerRowRender(column)}</td>
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
