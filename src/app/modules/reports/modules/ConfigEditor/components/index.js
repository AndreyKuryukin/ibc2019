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

const REPORT_TYPE_OPTIONS = [{
    value: 'PDF',
    title: 'PDF'
}, {
    value: 'XLS',
    title: 'XLS'
}];

const REPORT_MRF_OPTIONS = [{
    value: 'Волга',
    title: 'Волга'
}];

const REGULARITY_MAP = {
    'WEEK': ls('WEEKLY', 'Еженедельный'),
    'DAY': ls('DAILY', 'Ежедневный'),
    'MONTH': ls('MONTHLY', 'Ежемесячный'),
};

const NAME_PATTERNS = {
    ['TEMPLATE_ID']: ls('REPORT_TEMPLATE_PATTERN', '<Имя_шаблона>'),
    ['PERIOD.REGULARITY']: ls('REPORT_REGULARITY_PATTERN', '<Период_построения>'),
    ['TYPE']: ls('REPORT_TYPE_PATTERN', '<Формат>'),
};

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        users: PropTypes.array,
        templates: PropTypes.array,
        onSubmit: PropTypes.func,
        onMount: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        active: false,
        users: [],
        templates: [],
        onSubmit: () => null,
        onMount: () => null,
        errors: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            config: {
                config_name: '<Имя_шаблона>_Еженедельный_PDF',
                template_id: null,
                type: 'PDF',
                period: {
                    regularity: '',
                    auto: true,
                    start_date: null,
                    end_date: null,
                },
                notify_users: [],
                comment: '',
            },
            errors: null,
            templates: []
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
        if (this.state.templates !== nextProps.templates) {
            this.setState({ templates: nextProps.templates });
        }
    }

    getConfigProperty = (key, defaultValue) => {
        if (key === 'config_name' && _.get(this.state.config, 'period.auto')) {
            return this.composeConfigName();
        }
        return _.get(this.state.config, key, defaultValue);
    };

    composeConfigName = () => {
        const name = [];
        const templateId = this.getConfigProperty('template_id');
        const template = _.find(this.state.templates, tpl => tpl.id === templateId);
        if (template) {
            name.push(template.name);
        } else {
            name.push(NAME_PATTERNS['template_id'.toUpperCase()]);
        }

        const regularity = this.getConfigProperty('period.regularity');
        if (regularity) {
            name.push(REGULARITY_MAP[regularity]);
        } else {
            name.push(NAME_PATTERNS['period.regularity'.toUpperCase()]);
        }
        name.push(`${this.getConfigProperty('type') || NAME_PATTERNS['type'.toUpperCase()]}`);
        return name.join('_');
    };

    setConfigProperty = (key, value) => {
        const config = _.set({ ...this.state.config }, `${key}`, value);
        let errors = _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors;

        if (key === 'period.auto') {
            config.notify_users = value ? _.get('notify_users', []) : [];
        }

        if (_.get(config, 'period.auto')) {
            _.set(config, 'config_name', this.composeConfigName());
            errors = _.get(errors, 'config_name') ? _.omit(errors, 'config_name') : errors;
        }

        this.setState({
            config,
            errors
        });
    };

    onClose = () => {
        this.context.history.push('/reports');
    };

    onSubmit = () => {
        this.props.onSubmit(this.state.config);
    };

    mapTemplateOptions = templates => templates.map(tpl => ({ value: tpl.id, title: tpl.name }));

    onIntervalChange = (regularity, start, end, auto = false) => {
        const removeKeys = [
            ...(start ? ['period.start_date'] : []),
            ...(end ? ['period.end_date'] : []),
        ];

        this.setState({
            config: {
                ...this.state.config,
                notify_users: auto ? _.get('notify_users', []) : [],
                period: {
                    regularity: regularity.toUpperCase(),
                    start_date: start,
                    end_date: end,
                    auto,
                },
            },
            errors: _.omit(this.state.errors, removeKeys),
        });
    };

    render() {
        const { errors, templates } = this.state;

        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.configEditor}
                >
                    <ModalHeader toggle={this.onClose}
                                 className="handle">{ls('REPORTS_CONFIG_EDITOR_TITLE', 'Создание отчёта')}</ModalHeader>
                    <ModalBody>
                        <div className={styles.configEditorContent}>
                            <div className={styles.configEditorColumn}>
                                <Panel
                                    title={ls('REPORTS_CONFIG_EDITOR_SETTINGS_TITLE', 'Настройки отчёта')}
                                >
                                    <Field
                                        id="config-name"
                                        labelText={`${ls('REPORTS_CONFIG_EDITOR_NAME_FIELD', 'Название')}:`}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required
                                    >
                                        {!this.state.config.period.auto ? (
                                            <Input
                                                id="config-name"
                                                name="config-name"
                                                value={this.getConfigProperty('config_name')}
                                                onChange={event => this.setConfigProperty('config_name', _.get(event, 'target.value'))}
                                                valid={!_.get(errors, 'config_name.title', false)}
                                                errorMessage={_.get(errors, 'config_name.title')}
                                            />
                                        ) : (
                                            <div
                                                title={this.getConfigProperty('config_name')}
                                            >
                                                {this.getConfigProperty('config_name')}
                                            </div>
                                        )}
                                    </Field>
                                    <Field
                                        id="template-id"
                                        labelText={`${ls('REPORTS_CONFIG_EDITOR_TEMPLATE_FIELD', 'Шаблон')}:`}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required>
                                        <Select
                                            id="template-id"
                                            options={this.mapTemplateOptions(templates)}
                                            value={this.getConfigProperty('template_id')}
                                            onChange={value => this.setConfigProperty('template_id', value)}
                                            errorMessage={_.get(errors, 'template_id.title')}
                                            placeholder={ls('REPORTS_CONFIG_EDITOR_TEMPLATE_FIELD_PLACEHOLDER', 'Выберите шаблон отчета')}
                                            valid={!_.get(errors, 'template_id', false)}
                                        />
                                    </Field>
                                    <Field
                                        id="type"
                                        labelText={`${ls('REPORTS_CONFIG_EDITOR_TYPE_FIELD', 'Формат')}:`}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required
                                    >
                                        <Select
                                            id="type"
                                            options={REPORT_TYPE_OPTIONS}
                                            value={this.getConfigProperty('type')}
                                            placeholder={ls('REPORTS_CONFIG_EDITOR_TYPE_FIELD_PLACEHOLDER', 'Выберите формат отчета')}
                                            onChange={value => this.setConfigProperty('type', value)}
                                            valid={!_.get(errors, 'type', false)}
                                            errorMessage={_.get(errors, 'type.title')}
                                        />
                                    </Field>

                                </Panel>
                                <Panel
                                    title={ls('REPORTS_CONFIG_EDITOR_MRF_TITLE', 'МРФ')}
                                >
                                    <Field
                                        id="mrf"
                                        labelText={`${ls('REPORTS_CONFIG_EDITOR_MRF_FIELD', 'МРФ')}:`}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required
                                    >
                                        <Select
                                            id="mrf"
                                            options={REPORT_MRF_OPTIONS}
                                            value={this.getConfigProperty('mrf')}
                                            placeholder={ls('REPORTS_CONFIG_EDITOR_MRF_FIELD_PLACEHOLDER', 'Выберите МРФ')}
                                            onChange={value => this.setConfigProperty('mrf', value)}
                                            valid={!_.get(errors, 'mrf', false)}
                                            errorMessage={_.get(errors, 'mrf.title')}
                                        />
                                    </Field>
                                </Panel>
                                <Period
                                    onIntervalChange={this.onIntervalChange}
                                    onAutoCheck={value => this.setConfigProperty('period.auto', value)}
                                    errors={_.get(errors, 'period', null)}
                                />
                                <Panel

                                    title={ls('REPORTS_CONFIG_EDITOR_ROLE_COMMENT_TITLE', 'Комментарий')}
                                >
                                    <Input
                                        type="textarea"
                                        value={this.getConfigProperty('comment')}
                                        onChange={event => this.setConfigProperty('comment', _.get(event, 'target.value'))}
                                        rows={6}
                                    />
                                </Panel></div>
                            <div className={styles.configEditorColumn}>
                                <Panel
                                    title={ls('REPORTS_CONFIG_EDITOR_NOTIFY_USERS_TITLE', 'Рассылка для')}
                                    style={{ height: 250 }}
                                    bodyStyle={{ padding: 0 }}
                                >
                                    <UsersGrid
                                        usersData={this.props.users}
                                        onCheck={value => this.setConfigProperty('notify_users', value)}
                                        disabled={!this.getConfigProperty('period.auto', false)}
                                    />
                                </Panel>
                            </div>
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
