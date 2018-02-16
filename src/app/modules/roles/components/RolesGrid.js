import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'qreact';
import RolesControls from './RolesControls/RolesControls';
import RolesTable from '../containers/RolesTable';

class RolesGrid extends React.PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
        onDelete: PropTypes.func,
    }

    static defaultProps = {
        isLoading: false,
        onMount: () => null,
        onDelete: () => null,
    };

    state = {
        searchText: '',
        isAllChecked: false,
        checkedIds: [],
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    }

    onCheck = (isAllChecked, checkedIds) => {
        const checkedInfo = { isAllChecked };
        if (Array.isArray(checkedIds)) {
            checkedInfo.checkedIds = checkedIds;
        }

        this.setState({ ...checkedInfo });
    }

    onDelete = () => {
        if (typeof this.props.onDelete === 'function') {
            this.props.onDelete(this.state.checkedIds);
        }
    }

    render() {
        const { searchText, isAllChecked, checkedIds } = this.state;

        return (
            <Panel
                title="Роли"
                noScroll
                vertical
            >
                <RolesControls
                    isAllChecked={isAllChecked}
                    searchText={searchText}
                    onSearchTextChange={this.onSearchTextChange}
                    onCheckAll={this.onCheck}
                    onDelete={this.onDelete}
                />
                <RolesTable
                    searchText={searchText}
                    onCheck={this.onCheck}
                    isAllChecked={isAllChecked}
                    isLoading={this.props.isLoading}
                    checked={checkedIds}
                />
            </Panel>
        );
    }
}

export default RolesGrid;
