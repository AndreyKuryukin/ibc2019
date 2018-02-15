import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'qreact';

const mapStateToProps = () => ({
    id: 'roles-list-table',
    data: [{
        id: 1,
        name: 'Role1',
    }, {
        id: 2,
        name: 'Role2',
    }],
    scheme: {
        columns: [{
            type: Table.CELL_TYPES.TREE_CHECKED,
            columnKey: 'name',
            width: '1fr',
            sortable: true,
            resizable: true,
        }],
    },
    preloader: false,
    counters: false,
});

const RolesListTable = connect(mapStateToProps, )(Table);

export default RolesListTable;
