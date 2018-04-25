import React from 'react';
import PropTypes from 'prop-types';
import GroupPoliciesControls from './GroupPoliciesControls';
import GroupPoliciesTable from './GroupPoliciesTable';
import CrashesViewer from '../modules/Viewer/containers';
import styles from './styles.scss';

class GroupPolicies extends React.PureComponent {
    static contextTypes = {
        match: PropTypes.object.isRequired,
    };

    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
        alarmsList: PropTypes.array,
        onMount: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        alarmsList: [],
        onMount: () => null,
        isLoading: false,
    };

    constructor() {
        super();

        this.state = {
            searchText: '',
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    onApplyFilter = (filter) => {
        console.log(filter);
    };

    render() {
        const { params = {}, isLoading, alarmsList } = this.props;
        const { id: crashId } = params;
        const isCrashesViewerActive = !!crashId;

        return (
            <div className={styles.groupPoliciesWrapper}>
                <GroupPoliciesControls
                    onSearchTextChange={this.onSearchTextChange}
                    onApplyFilter={this.onApplyFilter}
                />
                <GroupPoliciesTable
                    data={alarmsList}
                    preloader={isLoading}
                    searchText={this.state.searchText}
                />
                {isCrashesViewerActive && <CrashesViewer crashId={crashId} active={isCrashesViewerActive} />}
            </div>
        );
    }
}

export default GroupPolicies;
