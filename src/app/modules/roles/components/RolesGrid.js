import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'qreact';
import RolesControls from '../containers/RolesControls';
import RolesTable from '../containers/RolesTable';

class RolesGrid extends React.PureComponent {
    static propTypes = {
        onMount: PropTypes.func,
    }

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

    render() {
        const { searchText, isAllChecked } = this.state;
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
                />
                <RolesTable
                    searchText={searchText}
                />
            </Panel>
        );
    }
}

export default RolesGrid;
