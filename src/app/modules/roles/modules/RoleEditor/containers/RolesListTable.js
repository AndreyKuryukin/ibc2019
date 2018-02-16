import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'qreact';
import { selectSubjects } from '../selectors';

const mapStateToProps = state => ({
    id: 'roles-list-table',
    data: selectSubjects(state),
    scheme: {
        columns: [{
            type: Table.CELL_TYPES.TREE_CHECKED,
            columnKey: 'name',
            width: '1fr',
            searchable: true,
            sortable: true,
            resizable: true,
        }],
    },
    preloader: false,
    counters: false,
});

const mapDispatchToProps = (dispatch, props) => ({
    onTableDataChange: ({ checked, isAllChecked }) => {
        const checkedIds = checked.map(row => row.id);
        props.onCheckRows(checkedIds);
        props.onCheckAll(isAllChecked);
    },
});

const RolesListTable = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Table);

export default RolesListTable;
