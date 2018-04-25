import React from 'react';
import PropTypes from 'prop-types';
import GroupPoliciesControls from './GroupPoliciesControls';
import GroupPoliciesTable from './GroupPoliciesTable';
import CrashesViewer from '../modules/Viewer/components';
import styles from './styles.scss';

const testData = [{ id: '1', priority: 'Critical', appearing_time: (new Date()).toString(), duration: '2d 05:16', policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE' }];

class GroupPolicies extends React.PureComponent {
    static contextTypes = {
        match: PropTypes.object.isRequired,
    };

    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
    };

    static defaultProps = {
        params: null,
    };

    constructor() {
        super();

        this.state = {
            searchText: '',
        };
    }

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    onApplyFilter = (filter) => {
        console.log(filter);
    };

    render() {
        const { params = {} } = this.props;
        const { id } = params;
        const isCrashesViewerActive = !!id;

        return (
            <div className={styles.groupPoliciesWrapper}>
                <GroupPoliciesControls
                    onSearchTextChange={this.onSearchTextChange}
                    onApplyFilter={this.onApplyFilter}
                />
                <GroupPoliciesTable
                    data={testData}
                    preloader={false}
                    searchText={this.state.searchText}
                />
                {isCrashesViewerActive && <CrashesViewer crash={testData[0]} active={isCrashesViewerActive} />}
            </div>
        );
    }
}

export default GroupPolicies;
