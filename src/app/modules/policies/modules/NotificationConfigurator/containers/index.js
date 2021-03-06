import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import NotificationConfiguratorComponent from '../components';
import { fetchAdaptersSuccess, fetchNotificationsSuccess } from '../actions';
import rest from '../../../../../rest';
import { validateForm } from '../../../../../util/validation';

class NotificationConfigurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        view: PropTypes.bool,
        policyId: PropTypes.string,
        adapters: PropTypes.array,
        notifications: PropTypes.array,
        onFetchAdaptersSuccess: PropTypes.func,
        onFetchNotificationsSuccess: PropTypes.func,
        fetchPolicies: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        view: true,
        policyId: '',
        adapters: [],
        notifications: [],
        onFetchAdaptersSuccess: () => null,
        onFetchNotificationsSuccess: () => null,
        fetchPolicies: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            policyName: '',
            isLoading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.notifications !== nextProps.notifications) {
            this.setState({ notifications: nextProps.notifications });
        }
    }

    onMount = () => {
        if (this.props.policyId) {
            this.setState({ isLoading: true });

            const urlParams = { policyId: this.props.policyId };
            Promise.all([
                rest.get('/api/v1/policy/notification/metadata'),
                rest.get('/api/v1/policy/:policyId/notifications', { urlParams }),
                rest.get('/api/v1/policy/:policyId', { urlParams })
            ])
                .then(([metadataResponse, notificationsResponse, policyResponse]) => {
                    this.props.onFetchAdaptersSuccess(metadataResponse.data);
                    this.props.onFetchNotificationsSuccess(notificationsResponse.data);
                    this.setState({
                        policyName: _.get(policyResponse, 'data.name', ''),
                        isLoading: false
                    });
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isLoading: false });
                });
        }
    };

    onSubmit = (notifications, adapters) => {
        if (this.props.policyId) {
            let isAllFieldsValid = true;
            const validatedNotifications = notifications.reduce((result, notification) => {
                const adapter = _.find(adapters, { adapter_id: notification.adapter_id });
                const paramsMetaData = _.get(adapter, 'parameters', []);
                const parameters = notification.parameters.map(param => {
                    const paramMetaData = _.find(paramsMetaData, paramMeta => paramMeta.uid === param.uid);
                    //todo: Сделать формирование кофига для валидации
                    const errors = validateForm({ [param.uid]: _.get(param, 'value.0', '') }, { [param.uid]: { required: !!_.get(paramMetaData, 'required') } });
                    isAllFieldsValid = isAllFieldsValid && _.isEmpty(errors);

                    return {
                        ...param,
                        errors: !_.isEmpty(errors) ? errors : null,
                    };
                });

                return [...result, {
                    ...notification,
                    errors: !_.isEmpty(adapter.instances) && !notification.instance_id ?
                        validateForm(
                            { instance_id: notification.instance_id },
                            { instance_id: { required: true } })
                        : null,
                    parameters,
                }];
            }, []);

            this.setState({ notifications: validatedNotifications });

            if (isAllFieldsValid) {
                rest.post(`/api/v1/policy/${this.props.policyId}/notifications`, notifications.map(cfg => ({
                    adapter_id: cfg.adapter_id,
                    instance_id: cfg.instance_id,
                    parameters: cfg.parameters.map(param => ({
                        uid: param.uid,
                        value: _.isArray(param.value) ? param.value : [param.value],
                    })),
                })))
                    .then(() => {
                        this.context.history.push('/policies');
                        this.props.fetchPolicies();
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            }
        }
    };

    render() {
        return (
            <NotificationConfiguratorComponent
                active={this.props.active}
                view={this.props.view}
                adapters={this.props.adapters}
                notifications={this.state.notifications}
                policyName={this.state.policyName}
                onSubmit={notification => this.onSubmit(notification, this.props.adapters)}
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
