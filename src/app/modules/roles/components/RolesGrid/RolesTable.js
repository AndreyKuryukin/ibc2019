import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'qreact';

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

    getScheme = () => ({
        columns: [{
            type: Table.CELL_TYPES.TREE_CHECKED,
            title: 'Роль',
            columnKey: 'name',
            width: '1fr',
            searchable: true,
            sortable: true,
            resizable: true,
            mapRowToParams: row => ({
                link: `/roles/edit/${row.id}`,
            }),
        }, {
            title: 'Комментарий',
            columnKey: 'description',
            width: '2fr',
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
                id="roles-table"
                scheme={scheme}
                counters={false}
            />
        );
    }
}

export default RolesTable;
