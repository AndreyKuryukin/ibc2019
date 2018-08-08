import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Field from '../../../../../components/Field';
import ls from 'i18n';
import styles from './styles.scss';
import DraggableWrapper from '../../../../../components/DraggableWrapper';
import Preloader from '../../../../../components/Preloader';
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
        view: PropTypes.bool,
        adapters: PropTypes.array,
        notifications: PropTypes.array,
        policyName: PropTypes.string,
        onClose: PropTypes.func,
        onSubmit: PropTypes.func,
        onMount: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
        view: true,
        adapters: [],
        notifications: [],
        policyName: '',
        onClose: () => null,
        onSubmit: () => null,
        onMount: () => null,
        isLoading: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            configs: null,
        };
    }

    componentDidMount() {
        const closeBtn = document.querySelector(`.${styles.notificationConfigurator} .close`);

        if (closeBtn) {
            closeBtn.setAttribute('itemId', 'policies_configurator_close');
        }

        this.props.onMount();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.notifications !== nextProps.notifications) {
            const configs = nextProps.notifications.reduce((result, cfg) => {
                const adapterConfig = nextProps.adapters.find(adapter => cfg && (adapter.adapter_id === cfg.adapter_id));

                return adapterConfig ? {
                    ...result,
                    [`${_.get(adapterConfig, 'adapter_id', '')}_${_.get(cfg, 'instance_id', '')}`]: {
                        ...adapterConfig,
                        instance_id: cfg.instance_id,
                        errors: cfg.errors || null,
                        parameters: adapterConfig.parameters.map(param => {
                            const parameter = cfg.parameters.find(p => p.uid === param.uid);

                            return {
                                ...param,
                                errors: parameter ? parameter.errors : null,
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
            const configs = _.reduce(this.state.configs, (result, cfg, key) =>
                key !== configId
                    ? { ...result, [key]: { ...cfg } }
                    : { ...result, [`${_.get(config, 'adapter_id', '')}_${instanceId}`]: { ...cfg, instance_id: instanceId }},
                {});

            this.setState({
                configs,
            });
        }
    };

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
    };

    onClose = () => {
        this.context.history.push('/policies');
        this.props.onClose();
    };

    onConfigRemove = (configId) => {
        this.setState({
            configs: _.omit(this.state.configs, configId),
        });
    };

    onSubmit = () => {
        const notificationsConfigs =
            _.chain(this.state.configs)
                .values()
                .map(cfg => ({
                    ...cfg,
                    parameters: cfg.parameters.map(param => ({
                        uid: param.uid,
                        ...(_.isUndefined(param.value) ? { value: [] } : { value: _.isArray(param.value) ? param.value : [param.value] }),
                    })),
                }))
                .value();
        this.props.onSubmit(notificationsConfigs);
    };

    render() {
        const { active, adapters, policyName, isLoading, view } = this.props;
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
                        <Preloader active={isLoading}>
                            <div
                                className={classnames(styles.notificationConfiguratorContent, { [styles.viewMode]: view })}>
                                <Field
                                    labelText={ls('POLICIES_CONFIGURATOR_POLICY_FIELD_LABEL', 'Политика')}
                                    inputWidth={'80%'}
                                    labelWidth={'20%'}
                                >
                                    <div className={styles.policyNameField} title={policyName}>{policyName}</div>
                                </Field>

                                <div className={styles.configsWrapper}>
                                    <Controls
                                        adapters={adapters}
                                        onAddConfig={this.onAddConfig}
                                        selectedConfigsKeys={selectedConfigsKeys}
                                    />
                                    <div className={styles.configs}>
                                        {_.map(this.state.configs, (config, key, configs) => (
                                            config && <ConfigBlock
                                                id={key}
                                                key={key}
                                                config={config}
                                                configs={Object.values(configs)}
                                                onChangeInstance={this.onChangeConfigInstance.bind(this, key)}
                                                onChangeParameters={this.onChangeConfigParameters.bind(this, key)}
                                                onRemove={this.onConfigRemove.bind(this, key)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Preloader>
                    </ModalBody>
                    <ModalFooter>
                        {!view &&
                        <Button itemId="policies_configurator_cancel" outline color="action" onClick={this.onClose}>{ls('CANCEL', 'Отмена')}</Button>}
                        {!view  && <Button itemId="policies_configurator_ok" color="action" onClick={this.onSubmit}>{ls('SUBMIT', 'Сохранить')}</Button>}
                        {view && <Button itemId="policies_configurator_close_button"  color="action" onClick={this.onClose}>{ls('CLOSE', 'Закрыть')}</Button>}
                    </ModalFooter>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default NotificationConfigurator;
