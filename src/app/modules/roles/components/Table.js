import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

class RolesTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        onTableDataChange: PropTypes.func,
        isAllChecked: PropTypes.bool,
        preloader: PropTypes.bool,
        checked: PropTypes.array,
    }

    static defaultProps = {
        data: [],
        searchText: '',
        onTableDataChange: () => null,
        isAllChecked: false,
        preloader: false,
        checked: [],
    };

    renderHeader = columns =>
        <thead>
        <tr>
            {columns.map(col => <th key={`col-${col.name}`}>{col.title}</th>)}
        </tr>
        </thead>;

    renderRow = (node, columns = []) =>
        <tr key={`node-${node.id}`}>
            {columns.map((col) => <td key={`node-${node.id}-${col.name}`}>{node[col.name]}</td>)}
        </tr>;

    getColumns = () => ([{
        title: 'Название',
        name: 'name'
    }, {
        title: 'Описание',
        name: 'description'
    }
    ]);

    filter = (data, columns, serchText) => data.filter(node => columns.map(col => col.name).find(name => node[name].indexOf(serchText) !== -1));

    render() {
        const {data, searchText} = this.props;
        const columns = this.getColumns();
        const resultData = searchText ? this.filter(data, columns, this.props.searchText) : data;
        return (
            <Table striped>
                {this.renderHeader(columns)}
                {resultData.map(node => this.renderRow(node, columns))}
            </Table>
        );
    }
}

export default RolesTable;
