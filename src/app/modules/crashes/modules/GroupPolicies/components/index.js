import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import GroupPoliciesControls from './GroupPoliciesControls';
import GroupPoliciesTable from './GroupPoliciesTable';
import CrashesViewer from '../modules/Viewer/containers';
import styles from './styles.scss';

class GroupPolicies extends React.PureComponent {
    static contextTypes = {
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
        alarmsList: PropTypes.array,
        filter: PropTypes.object,
        onMount: PropTypes.func,
        onApplyFilter: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        alarmsList: [],
        onMount: () => null,
        onApplyFilter: () => null,
        isLoading: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            filter: props.filter,
        };
    }

    componentDidMount() {
        const params = new URLSearchParams(this.context.location.search);
        const filter = {
            mrf: params.get('mrf'),
            rf: params.get('rf'),
        };
        if (typeof this.props.onMount === 'function') {
            this.props.onMount(filter);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.filter !== nextProps.filter) {
            this.setState({ filter: nextProps.filter });
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    onApplyFilter = (filter) => {
        this.setState({ filter });
        this.props.onApplyFilter(filter);
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
                    mrf={_.get(this.state.filter, 'mrf', '')}
                    rf={_.get(this.state.filter, 'rf', '')}
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
