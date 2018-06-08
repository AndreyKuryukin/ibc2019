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

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        policiesData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        policiesData: [],
        isLoading: false,
        onMount: () => null,
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
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    navigateNotificationConfig = (policyId) => {
        this.props.history.push(`/policies/cofigure/${policyId}`)
    };

    render() {
        const { policiesData: data, isLoading, match } = this.props;
        const { searchText } = this.state;

        const { params } = match;
        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const isConfiguratorActive = params.action === 'cofigure';
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
                {isConfiguratorActive && <NotificationConfigurator
                    active={isConfiguratorActive}
                    policyId={policyId}
                />}
            </div>
        );
    }
}

export default Policies;
