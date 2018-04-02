import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createSelector } from 'reselect';
import Grid from '../../../../../components/Grid';
import { CheckedCell, DefaultCell } from '../../../../../components/Table/Cells';
import search from '../../../../../util/search';

class UsersGrid extends React.PureComponent {
    static propTypes = {
        usersData: PropTypes.array,
        disabled: PropTypes.bool,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        disabled: false,
        onCheck: () => null,
    };

    static mapDataFromProps = createSelector(
        props => props.usersData,
        users => users.map((user) => ({
            id: user.id,
            name: `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`
        })),
    );

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            checked: [],
        };
    }

    getColumns = () => [{
        name: 'name',
        searchable: true,
    }];

    bodyRowRender = (column, node) => (
        <CheckedCell
            id={`report-user-grid-${node.id}`}
            onChange={(value) => this.onCheck(value, node)}
            style={{ marginLeft: 0 }}
            value={this.state.checked.includes(node.id)}
            text={_.get(node, column.name, '')}
        />
    );

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.usersData.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });
        this.props.onCheck(checked);
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
        const { disabled } = this.props;
        const { checked, searchText } = this.state;

        const mappedData = UsersGrid.mapDataFromProps(this.props);

        const columns = this.getColumns();
        const checkedPartially = mappedData.length !== 0 && checked.length > 0 && checked.length < mappedData.length;
        const isAllChecked = !checkedPartially && mappedData.length !== 0 && checked.length === mappedData.length;
        const filteredData = searchText ? this.filter(mappedData, columns, searchText) : mappedData;

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
                disabled={disabled}
            />
        );
    }
}

export default UsersGrid;
