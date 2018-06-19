import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import memoize from 'memoizejs';
import { CheckedCell, DefaultCell } from '../../../../../components/Table/Cells';
import Grid from '../../../../../components/Grid';
import search from '../../../../../util/search';

class RolesGrid extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array,
        onCheck: PropTypes.func
    };

    static defaultProps = {
        onCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: props.checked,
            searchText: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.checked, nextProps.checked)) {
            this.setState({ checked: nextProps.checked });
        }
    }

    static getColumns = memoize(() => [{
        name: 'name',
        searchable: true,
    }]);

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id);
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });
        this.props.onCheck(checked);
    };

    bodyRowRender = (column, node) => (
        <CheckedCell
            id={`${this.props.id}-${node.id}`}
            onChange={(value) => this.onCheck(value, node)}
            style={{ marginLeft: 0 }}
            value={this.state.checked.includes(node.id)}
            text={node[column.name]}
        />
    );

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    render() {
        const { checked, searchText } = this.state;
        const { data } = this.props;
        const columns = RolesGrid.getColumns();
        const checkedPartially = data.length !== 0 && checked.length > 0 && checked.length < this.props.data.length;
        const isAllChecked = !checkedPartially && data.length !== 0 && checked.length === data.length;
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;

        return (
            <Grid
                id={this.props.id}
                style={{maxWidth: 200}}
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

export default RolesGrid;
