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

    render() {
        return (
            <Table/>
        );
    }
}

export default RolesTable;
