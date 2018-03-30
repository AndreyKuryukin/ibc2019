import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from 'i18n';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import DraggableWrapper from "../../../../../components/DraggableWrapper";
import Period from './Period';
import UsersGrid from './UsersGrid';
import styles from './styles.scss';

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        onSubmit: () => null,
        onClose: () => null,
        onMount: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            config: {
                config_name: '',
                template_id: null,
                type: 'pdf',
                period: {
                    regularity: 'other',
                    auto: false,
                    start_date: null,
                    end_date: null,
                },
                notify_users: [],
                comment: '',
            },
        };
    }

    getConfigProperty = (key, defaultValue) => _.get(this.state.config, key, defaultValue);

    setConfigProperty = (key, value) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };

        this.setState({ config });
    }

    onClose = () => {
        this.context.history.push('/reports');
        this.props.onClose();
    };

    onSubmit = () => {
        console.log(this.state.config);
    };

    render() {
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.configEditor}
                >
                    <ModalHeader toggle={this.onClose} className="handle">{ls('REPORTS_CONFIG_EDITOR_TITLE', 'Создание отчёта')}</ModalHeader>
                    <ModalBody>
                        <div className={styles.configEditorContent}>
                            <Panel
                                title={ls('REPORTS_CONFIG_EDITOR_SETTINGS_TITLE', 'Настройки отчёта')}
                            >
                                <Field
                                    id="config-name"
                                    labelText={`${ls('REPORTS_CONFIG_EDITOR_NAME_FIELD', 'Название')}:`}
                                    labelWidth="35%"
                                    inputWidth="65%"
                                >
                                    <Input
                                        id="config-name"
                                        name="config-name"
                                        value={this.getConfigProperty('config_name')}
                                        onChange={event => this.setConfigProperty('config_name', _.get(event, 'target.value'))}
                                    />
                                </Field>
                                <Field
                                    id="template-id"
                                    labelText={`${ls('REPORTS_CONFIG_EDITOR_TEMPLATE_FIELD', 'Шаблон')}:`}
                                    labelWidth="35%"
                                    inputWidth="65%"
                                >
                                    <Select
                                        id="template-id"
                                        options={[]}
                                        value={this.getConfigProperty('template_id')}
                                        onChange={value => this.setConfigProperty('template_id', value)}
                                    />
                                </Field>
                                <Field
                                    id="type"
                                    labelText={`${ls('REPORTS_CONFIG_EDITOR_TYPE_FIELD', 'Формат')}:`}
                                    labelWidth="35%"
                                    inputWidth="65%"
                                >
                                    <Select
                                        id="type"
                                        options={[]}
                                        value={this.getConfigProperty('type')}
                                        onChange={value => this.setConfigProperty('type', value)}
                                    />
                                </Field>
                            </Panel>
                            <Period />
                            <Panel
                                title={ls('REPORTS_CONFIG_EDITOR_USERS_TITLE', 'Пользователи')}
                                style={{ height: 250 }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <UsersGrid
                                    usersData={[
                                        { id: 1, name: 'Probe 1' },
                                        { id: 2, name: 'Probe 2' },
                                        { id: 3, name: 'Probe 3' },
                                    ]}
                                />
                            </Panel>
                            <Panel
                                title={ls('REPORTS_CONFIG_EDITOR_ROLE_COMMENT_TITLE', 'Комментарий')}
                            >
                                <Input
                                    type="textarea"
                                    value={this.getConfigProperty('comment')}
                                    onChange={event => this.setConfigProperty('comment', _.get(event, 'target.value'))}
                                    rows={6}
                                />
                            </Panel>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="action" onClick={this.onClose}>{ls('CANCEL', 'Отмена')}</Button>
                        <Button color="action" onClick={this.onSubmit}>{ls('REPORT_EDITOR_SUBMIT', 'Создать')}</Button>
                    </ModalFooter>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default ConfigEditor;
