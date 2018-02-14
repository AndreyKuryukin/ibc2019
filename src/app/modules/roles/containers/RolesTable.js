import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'qreact';

const mapStateToProps = () => ({
    id: 'roles-table',
    data: [{
        id: 1,
        name: 'Super admin',
        number: '1',
        comment: 'Comment for super admin',
    }],
    scheme: {
        columns: [{
            type: Table.CELL_TYPES.TREE_CHECKED,
            title: 'Роль',
            columnKey: 'name',
            width: '1fr',
            sortable: true,
            resizable: true,
        }, {
            title: 'Количество пользователей',
            columnKey: 'number',
            width: '1fr',
            sortable: true,
            resizable: true,
        }, {
            title: 'Комментарий',
            columnKey: 'comment',
            width: '2fr',
            sortable: true,
            resizable: true,
        }],
    },
    preloader: false,
    counters: false,
});

const mapDispatchToProps = dispatch => ({
    onTableDataChange: ({ checked, isAllChecked }) => {
        console.log(isAllChecked);
        console.log(checked);
    },
});

const RolesTable = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Table);

export default RolesTable;
