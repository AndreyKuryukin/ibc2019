import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import GroupPoliciesControls from './GroupPoliciesControls';
import GroupPoliciesTable from './GroupPoliciesTable';
import AlarmsViewer from '../modules/Viewer/containers';
import styles from './styles.scss';

class GroupPolicies extends React.PureComponent {
    static contextTypes = {
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
        alarmsList: PropTypes.array,
        rfOptions: PropTypes.array,
        mrfOptions: PropTypes.array,
        filter: PropTypes.object,
        onMount: PropTypes.func,
        onApplyFilter: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        alarmsList: [],
        rfOptions: [],
        mrfOptions: [],
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
        const { id: alarmId } = params;
        const isAlarmsViewerActive = !!alarmId;

        return (
            <div className={styles.groupPoliciesWrapper}>
                <GroupPoliciesControls
                    onSearchTextChange={this.onSearchTextChange}
                    onApplyFilter={this.onApplyFilter}
                    rfOptions={this.props.rfOptions}
                    mrfOptions={this.props.mrfOptions}
                    mrf={_.get(this.state.filter, 'mrf', '')}
                    rf={_.get(this.state.filter, 'rf', '')}
                />
                <GroupPoliciesTable
                    data={alarmsList}
                    preloader={isLoading}
                    searchText={this.state.searchText}
                />
                {isAlarmsViewerActive && <AlarmsViewer alarmId={alarmId} active={isAlarmsViewerActive} />}
            </div>
        );
    }
}

export default GroupPolicies;
