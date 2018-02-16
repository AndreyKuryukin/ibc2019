import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'qreact';
import RolesListControls from './RolesListControls/RolesListControls';
import RolesListTable from '../containers/RolesListTable';

class RolesListGrid extends React.PureComponent {
    static propTypes = {
        onMount: PropTypes.func,
        onCheckRows: PropTypes.func,
        checked: PropTypes.array,
        isLoading: PropTypes.bool,
    }

    static defaultProps = {
        checked: null,
        isLoading: false,
        onCheckRows: () => null,
        onMount: () => null,
    };

    state = {
        searchText: '',
        isAllChecked: false,
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

    onCheckAll = (isAllChecked) => {
        this.setState({
            isAllChecked,
        });
    }

    render() {
        const { searchText, isAllChecked } = this.state;
        const { checked, onCheckRows, isLoading } = this.props;
        return (
            <Panel
                noScroll
                vertical
            >
                <RolesListControls
                    isAllChecked={isAllChecked}
                    searchText={searchText}
                    onSearchTextChange={this.onSearchTextChange}
                    onCheckAll={this.onCheckAll}
                />
                <RolesListTable
                    searchText={searchText}
                    onCheckAll={this.onCheckAll}
                    onCheckRows={onCheckRows}
                    isAllChecked={isAllChecked}
                    isLoading={isLoading}
                    checked={checked}
                />
            </Panel>
        );
    }
}

export default RolesListGrid;

