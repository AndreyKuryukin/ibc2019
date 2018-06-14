import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Icon from '../../../../../components/Icon/Icon';
import ls from 'i18n';
import styles from './styles.scss';
import DraggableWrapper from '../../../../../components/DraggableWrapper';
import ConfigBlock from './ConfigBlock';
import Controls from './Controls';

const controlFieldStyle = { flexGrow: 1 };
const adapterFieldStyle = { ...controlFieldStyle, marginLeft: 10 };
const instanceFieldStyle = { ...controlFieldStyle, marginTop: 0 };

class NotificationConfigurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        adapters: PropTypes.array,
        notifications: PropTypes.array,
        onClose: PropTypes.func,
        onSubmit: PropTypes.func,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        adapters: [],
        notifications: [],
        onClose: () => null,
        onSubmit: () => null,
        onMount: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            configs: null,
        };
    }

    componentDidMount() {
        this.props.onMount();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.notifications !== nextProps.notifications) {
            const configs = nextProps.notifications.reduce((result, cfg) => {
                const adapterConfig = nextProps.adapters.find(adapter => adapter.adapter_id === cfg.adapter_id);

                return adapterConfig ? {
                    ...result,
                    [`${_.get(adapterConfig, 'adapter_id', '')}_${_.get(cfg, 'instance_id', '')}`]: {
                        ...adapterConfig,
                        instance_id: cfg.instance_id,
                        parameters: adapterConfig.parameters.map(param => {
                            const parameter = cfg.parameters.find(p => p.uid === param.uid);

                            return {
                                ...param,
                                value: parameter ? parameter.value : '',
                            };
                        }),
                    },
                } : result;
            }, {});

            this.setState({
                configs: {
                    ...this.state.configs,
                    ...configs,
                },
            });
        }
    }

    onAddConfig = (config) => {
        this.setState({
            configs: {
                ...this.state.configs,
                [`${_.get(config, 'adapter_id', '')}_${_.get(config, 'instance_id', '')}`]: config,
            },
        });
    };

    onChangeConfigInstance = (configId, instanceId) => {
        const config = _.get(this.state.configs, `${configId}`);

        if (config) {
            const configs = {
                ..._.omit({...this.state.configs}, `${configId}`),
                [`${_.get(config, 'adapter_id', '')}_${instanceId}`]: {
                    ...config,
                    instance_id: instanceId,
                },
            }

            this.setState({
                configs,
            });
        }
    }

    onChangeConfigParameters = (configId, parameters) => {
        const config = _.get(this.state.configs, `${configId}`);

        if (config) {
            const configs = {
                ...this.state.configs,
                [configId]: {
                    ...config,
                    parameters,
                },
            }

            this.setState({
                configs,
            });
        }
    }

    onClose = () => {
        this.context.history.push('/policies');
        this.props.onClose();
    };

    onConfigRemove = (configId) => {
        this.setState({
            configs: _.omit(this.state.configs, configId),
        });
    }

    onSubmit = () => {
        const notificationsConfigs =
            _.chain(this.state.configs)
                .values()
                .map(cfg => ({
                    adapter_id: cfg.adapter_id,
                    instance_id: cfg.instance_id,
                    parameters: cfg.parameters.map(param => ({
                        uid: param.uid,
                        value: _.isArray(param.value) ? param.value : [param.value],
                    })),
                }))
                .value();

        this.props.onSubmit(notificationsConfigs);
    };

    render() {
        const { active, adapters } = this.props;
        const selectedConfigsKeys = _.keys(this.state.configs);
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={active}
                    className={styles.notificationConfigurator}
                >
                    <ModalHeader toggle={this.onClose} className="handle">
                        {ls('POLICIES_NOTIFICATION_CONFIGURATOR_TITLE', 'Конфигурация нотификатора')}
                    </ModalHeader>
                    <ModalBody>
                        <div className={styles.notificationConfiguratorContent}>
                            <div>{`${ls('POLICIES_CONFIGURATOR_POLICY_FIELD_LABEL', 'Политика')}: ${'ALARM_STB_MLR'}`}</div>
                            <div className={styles.configsWrapper}>
                                <Controls
                                    adapters={adapters}
                                    onAddConfig={this.onAddConfig}
                                    selectedConfigsKeys={selectedConfigsKeys}
                                />
                                <div className={styles.configs}>
                                    {_.map(this.state.configs, (config, key) => (
                                        config && <ConfigBlock
                                            id={key}
                                            key={key}
                                            config={config}
                                            onChangeInstance={this.onChangeConfigInstance.bind(this, key)}
                                            onChangeParameters={this.onChangeConfigParameters.bind(this, key)}
                                            onRemove={this.onConfigRemove.bind(this, key)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="action" onClick={this.onClose}>{ls('CANCEL', 'Отмена')}</Button>
                        <Button color="action" onClick={this.onSubmit}>{ls('SUBMIT', 'Сохранить')}</Button>
                    </ModalFooter>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default NotificationConfigurator;
