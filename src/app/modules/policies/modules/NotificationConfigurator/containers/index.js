import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationConfiguratorComponent from '../components';
import { fetchAdaptersSuccess, fetchNotificationsSuccess } from '../actions';
import rest from '../../../../../rest';

const adapters = [{
    adapter_id: '1',
    name: 'Аудио-визуальный',
    instances: [],
    parameters: [],
}, {
    adapter_id: '2',
    name: 'CRM',
    instances: [{
        instance_id: '21',
        name: 'Prod',
    }, {
        instance_id: '22',
        name: 'Test',
    }],
    parameters: [{
        type: 'string',
        uid: '23',
        name: 'Type1',
    }, {
        type: 'integer',
        uid: '24',
        name: 'Type2'
    }, {
        type: 'enum',
        uid: '25',
        name: 'Type3',
        required: true,
        values: [{
            name: 'Tech Support',
            value: 'tech_support',
        }, {
            name: 'The quality of Services',
            value: 'the_quality_of_services',
        }, {
            name: 'Distortion on all channels',
            value: 'distortion_on_all_channels',
        }]
    }],
}, {
    adapter_id: '3',
    name: 'SMS',
    instances: [{
        instance_id: '31',
        name: 'SMPP-GW-1',
    }, {
        instance_id: '32',
        name: 'SMPP-GW-2',
    }],
    parameters: [],
}];

const notifications = [{
    adapter_id: '2',
    instance_id: '21',
    parameters: [{
        uid: '23',
        value: 'Text value',
    }, {
        uid: '25',
        value: 'distortion_on_all_channels',
    }]
}];

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

    onMount = () => {
        if (this.props.policyId) {
            Promise.all([
                rest.get('/api/v1/policy/notification/metadata'),
                rest.get(`/api/v1/policy/${this.props.policyId}/notifications`)
            ])
                .then(([metadataResponse, notificationsResponse]) => {
                    this.props.onFetchAdaptersSuccess(metadataResponse.data);
                    this.props.onFetchNotificationsSuccess(notificationsResponse.data);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };

    onSubmit = (notifications) => {
        if (this.props.policyId) {
            rest.post(`/api/v1/policy/${this.props.policyId}/notifications`, notifications)
                .then(() => {
                    console.log('Success');
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
