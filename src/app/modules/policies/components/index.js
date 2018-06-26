import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import PoliciesTable from './PoliciesTable';
import PoliciesControls from './PoliciesControls';
import PolicyEditor from '../modules/PolicyEditor/containers';
import NotificationConfigurator from '../modules/NotificationConfigurator/containers';

class Policies extends React.Component {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        policiesData: PropTypes.array,
        isLoading: PropTypes.bool,
        fetchPolicies: PropTypes.func,
    };

    static defaultProps = {
        policiesData: [],
        isLoading: false,
        fetchPolicies: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.fetchPolicies();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    navigateNotificationConfig = (policyId, edit) => {
        this.props.history.push(`/policies/${edit ? 'configure' : 'view'}/${policyId}`)
    };

    render() {
        const { policiesData: data, isLoading, match, fetchPolicies } = this.props;
        const { searchText } = this.state;

        const { params } = match;
        const isEditorActive = this.context.hasAccess('POLICY', 'EDIT') && (params.action === 'edit' || params.action === 'add');
        const isConfiguratorActive = params.action === 'configure';
        const isConfiguratorViewActive = params.action === 'view';
        const policyId = params.id ? params.id : null;

        return (
            <div className={styles.policiesWrapper}>
                <PoliciesControls
                    onSearchTextChange={this.onSearchTextChange}
                />
                <PoliciesTable
                    data={data}
                    searchText={searchText}
                    preloader={isLoading}
                    notificationClick={this.navigateNotificationConfig}
                />
                {isEditorActive && <PolicyEditor
                    active={isEditorActive}
                    policyId={policyId}
                    policies={data}
                />}
                {(isConfiguratorActive || isConfiguratorViewActive) && <NotificationConfigurator
                    active={(isConfiguratorActive || isConfiguratorViewActive)}
                    view={isConfiguratorViewActive}
                    policyId={policyId}
                    fetchPolicies={fetchPolicies}
                />}
            </div>
        );
    }
}

export default Policies;
