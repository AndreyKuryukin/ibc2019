import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Grid from '../../../../../components/Grid';
import { CheckedCell, DefaultCell } from '../../../../../components/Table/Cells';
import search from '../../../../../util/search';

class UsersGrid extends React.PureComponent {
    static propTypes = {
        usersData: PropTypes.array,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        onCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            checked: [],
        };
    }

    getColumns = () => [{
        name: 'checked',
        width: 28,
    }, {
        name: 'name',
        searchable: true,
    }];

    bodyRowRender = (column, node) => {
        switch (column.name) {
            case 'checked': {
                return (
                    <CheckedCell
                        id={`report-user-grid-${node.id}`}
                        onChange={value => this.onCheck(value, node)}
                        style={{ marginLeft: 0 }}
                        value={this.state.checked.includes(node.id)}
                    />
                );
            }
            default:
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
        }
    };

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.usersData.map(node => node.id) : [];
        }

        this.props.onCheck(checked);

        this.setState({
            checked,
        });
    };

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    render() {
        const { usersData: data } = this.props;
        const { checked, searchText } = this.state;

        const columns = this.getColumns();
        const checkedPartially = data.length !== 0 && checked.length > 0 && checked.length < data.length;
        const isAllChecked = !checkedPartially && data.length !== 0 && checked.length === data.length;
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;

        return (
            <Grid
                id="report-user-grid"
                data={filteredData}
                columns={columns}
                bodyRowRender={this.bodyRowRender}
                isAllChecked={isAllChecked}
                checkedPartially={checkedPartially}
                onCheckAll={this.onCheck}
                onSearchTextChange={this.onSearchTextChange}
            />
        );
    }
}

export default UsersGrid;
