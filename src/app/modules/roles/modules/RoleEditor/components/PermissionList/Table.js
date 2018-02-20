import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'qreact';

class RolesListTable extends React.PureComponent {
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

    getScheme = () => ({
        columns: [{
            type: Table.CELL_TYPES.TREE_CHECKED,
            columnKey: 'name',
            width: '1fr',
            searchable: true,
            sortable: true,
            resizable: true,
        }],
    });

    render() {
        const scheme = this.getScheme();
        return (
            <Table
                {...this.props}
                id="roles-list-table"
                scheme={scheme}
                counters={false}
            />
        );
    }
}

export default RolesListTable;
