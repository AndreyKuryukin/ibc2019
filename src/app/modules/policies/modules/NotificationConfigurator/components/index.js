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

const controlFieldStyle = { flexGrow: 1 };
const adapterFieldStyle = { ...controlFieldStyle, marginLeft: 10 };
const instanceFieldStyle = { ...controlFieldStyle, marginTop: 0 };

class NotificationConfigurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        onClose: PropTypes.func,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        onClose: () => null,
        onSubmit: () => null,
    };

    onClose = () => {
        this.context.history.push('/policies');
        this.props.onClose();
    };

    onSubmit = () => {
        this.props.onSubmit();
    };

    render() {
        const { active } = this.props;
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
                                <div className={styles.configsControls}>
                                    <Icon icon="addIcon" onClick={() => null} />
                                    <Field
                                        id="adapter"
                                        inputWidth="100%"
                                        style={adapterFieldStyle}
                                        splitter=""
                                    >
                                        <Select
                                            id="adapter"
                                            options={[]}
                                            value={''}
                                            onChange={() => null}
                                        />
                                    </Field>
                                    <Field
                                        id="instance"
                                        labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                                        labelWidth="30%"
                                        inputWidth={115}
                                        style={instanceFieldStyle}
                                    >
                                        <Select
                                            id="instance"
                                            options={[]}
                                            value={''}
                                            onChange={() => null}
                                        />
                                    </Field>
                                </div>
                                <div className={styles.configs}>
                                    <ConfigBlock>
                                        <div className={styles.adapterName}>{`${ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_LABEL', 'Адаптер')}: ${'Аудио-визуальный'}`}</div>
                                    </ConfigBlock>
                                    <ConfigBlock>
                                        <div className={styles.configContentRow}>
                                            <div className={styles.adapterName}>
                                                {`${ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_LABEL', 'Адаптер')}: ${'CRM'}`}
                                            </div>
                                            <Field
                                                id="instance"
                                                labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                                                inputWidth={115}
                                                style={instanceFieldStyle}
                                            >
                                                <Select
                                                    id="instance"
                                                    options={[]}
                                                    value={''}
                                                    onChange={() => null}
                                                />
                                            </Field>
                                        </div>
                                        <div className={styles.configContentColumn}>
                                            <Field
                                                id="Type1ID"
                                                labelText="Type1ID"
                                                inputWidth="50%"
                                            >
                                                <Select
                                                    id="Type1ID"
                                                    options={[]}
                                                    value={''}
                                                    onChange={() => null}
                                                />
                                            </Field>
                                            <Field
                                                id="Type2ID"
                                                labelText="Type2ID"
                                                inputWidth="50%"
                                            >
                                                <Select
                                                    id="Type2ID"
                                                    options={[]}
                                                    value={''}
                                                    onChange={() => null}
                                                />
                                            </Field>
                                            <Field
                                                id="Type3ID"
                                                labelText="Type3ID"
                                                inputWidth="50%"
                                            >
                                                <Select
                                                    id="Type3ID"
                                                    options={[]}
                                                    value={''}
                                                    onChange={() => null}
                                                />
                                            </Field>
                                        </div>
                                    </ConfigBlock>
                                    <ConfigBlock>
                                        <div className={styles.configContentRow}>
                                            <div className={styles.adapterName}>
                                                {`${ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_LABEL', 'Адаптер')}: ${''}`}
                                            </div>
                                            <Field
                                                id="instance"
                                                labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                                                inputWidth={115}
                                                style={instanceFieldStyle}
                                            >
                                                <Select
                                                    id="instance"
                                                    options={[]}
                                                    value={''}
                                                    onChange={() => null}
                                                />
                                            </Field>
                                        </div>
                                    </ConfigBlock>
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
