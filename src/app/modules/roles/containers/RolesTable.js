import { connect } from 'react-redux';
import { Table } from 'qreact';
import { selectRolesData } from '../selectors';

const mapStateToProps = state => ({
    id: 'roles-table',
    data: selectRolesData(state),
    scheme: {
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
    },
    preloader: false,
    counters: false,
});

const mapDispatchToProps = (dispatch, props) => ({
    onTableDataChange: ({ checked, isAllChecked }) => {
        const checkedIds = checked.map(row => row.id);
        props.onCheck(isAllChecked, checkedIds);
    },
});

const RolesTable = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Table);

export default RolesTable;
