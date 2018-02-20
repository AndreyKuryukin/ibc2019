import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'qreact';
import RolesListTable from './Table';
import RolesListControls from './Controls';

class RolesListGrid extends React.PureComponent {
    static propTypes = {
        subjectsData: PropTypes.array,
        checked: PropTypes.array,
        onCheckRows: PropTypes.func,
        onFetchSubjectsSuccess: PropTypes.func,
    };

    static defaultProps = {
        subjectsData: [],
        checked: [],
        onFetchSubjectsSuccess: () => null,
        onCheckRows: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            isAllChecked: false,
            isLoading: false,
        };
    }

    componentDidMount() {

    }

    onCheck = (isAllChecked, checkedIds) => {
        if (Array.isArray(checkedIds)) {
            this.props.onCheckRows(checkedIds);
        }

        this.setState({ isAllChecked });
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    }

    onTableDataChange = ({ checked, isAllChecked }) => {
        const checkedIds = checked.map(row => row.id);
        this.onCheck(isAllChecked, checkedIds);
    }

    render() {
        const {
            searchText,
            isAllChecked,
            isLoading,
        } = this.state;
        return (
            <Panel
                noScroll
                vertical
            >
                <RolesListControls
                    isAllChecked={isAllChecked}
                    searchText={searchText}
                    onSearchTextChange={this.onSearchTextChange}
                    onCheckAll={this.onCheck}
                />
                <RolesListTable
                    searchText={searchText}
                    isAllChecked={isAllChecked}
                    preloader={isLoading}
                    checked={this.props.checked}
                    onTableDataChange={this.onTableDataChange}
                    data={this.props.subjectsData}
                />
            </Panel>
        );
    }
}

export default RolesListGrid;
