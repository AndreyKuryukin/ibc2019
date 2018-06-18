import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationConfiguratorComponent from '../components';
import { fetchAdaptersSuccess, fetchNotificationsSuccess } from '../actions';
import rest from '../../../../../rest';

class NotificationConfigurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        policyId: PropTypes.string,
        adapters: PropTypes.array,
        notifications: PropTypes.array,
        onFetchAdaptersSuccess: PropTypes.func,
        onFetchNotificationsSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        policyId: '',
        adapters: [],
        notifications: [],
        onFetchAdaptersSuccess: () => null,
        onFetchNotificationsSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    onMount = () => {
        if (this.props.policyId) {
            this.setState({ isLoading: true });
            Promise.all([
                rest.get('/api/v1/policy/notification/metadata'),
                rest.get(`/api/v1/policy/${this.props.policyId}/notifications`)
            ])
                .then(([metadataResponse, notificationsResponse]) => {
                    this.props.onFetchAdaptersSuccess(metadataResponse.data);
                    this.props.onFetchNotificationsSuccess(notificationsResponse.data);
                    this.setState({ isLoading: false });
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isLoading: false });
                });
        }
    };

    onSubmit = (notifications) => {
        if (this.props.policyId) {
            rest.post(`/api/v1/policy/${this.props.policyId}/notifications`, notifications)
                .then(() => {
                    this.context.history.push('/policies');
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };

    render() {
        return (
            <NotificationConfiguratorComponent
                active={this.props.active}
                adapters={this.props.adapters}
                notifications={this.props.notifications}
                onSubmit={this.onSubmit}
                onMount={this.onMount}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    adapters: state.policies.notificationConfigurator.adapters,
    notifications: state.policies.notificationConfigurator.notifications,
});

const mapDispatchToProps = dispatch => ({
    onFetchAdaptersSuccess: adapters => dispatch(fetchAdaptersSuccess(adapters)),
    onFetchNotificationsSuccess: notifications => dispatch(fetchNotificationsSuccess(notifications)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NotificationConfigurator);
