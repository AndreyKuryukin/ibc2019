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
import DisplayField from "../../../../../components/DisplayField/index";

// const REPORT_TYPE_OPTIONS = [{
//     value: 'PDF',
//     title: 'PDF'
// }, {
//     value: 'XLS',
//     title: 'XLS'
// }];

const panelStyle = { height: 250 };
const panelBodyStyle = { padding: 0 };

const REGULARITY_MAP = {
    'WEEK': ls('WEEKLY', 'Еженедельный'),
    'DAY': ls('DAILY', 'Ежедневный'),
    'MONTH': ls('MONTHLY', 'Ежемесячный'),
};

const NAME_PATTERNS = {
    ['TEMPLATE_ID']: ls('REPORT_TEMPLATE_PATTERN', '<Имя_шаблона>'),
    ['PERIOD.REGULARITY']: ls('REPORT_REGULARITY_PATTERN', '<Период_построения>'),
    ['TYPE']: ls('REPORT_TYPE_PATTERN', '<Формат>'),
    ['MRF']: ls('REPORT_MRF_PATTERN', '<МРФ>')
};

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        users: PropTypes.array,
        templates: PropTypes.array,
        locations: PropTypes.array,
        onSubmit: PropTypes.func,
        onMount: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        active: false,
        users: [],
        templates: [],
        locations: [],
        onSubmit: () => null,
        onMount: () => null,
        errors: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            config: {
                name: '<Имя_шаблона>_Еженедельный_<МРФ>_PDF',
                template_id: null,
                type: 'XLSX',
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

    mapLocationOptions = (locations) => locations.map(location => ({ title: location.name, value: location.id }));

    getConfigProperty = (key, defaultValue) => _.get(this.state.config, key, defaultValue);

    composeConfigName = (templateId, regularity, type, mrfId) => {
        const name = [];
        const template = _.find(this.state.templates, tpl => tpl.id === templateId);
        if (template) {
            name.push(template.name);
        } else {
            name.push(NAME_PATTERNS['template_id'.toUpperCase()]);
        }

        if (regularity) {
            name.push(REGULARITY_MAP[regularity]);
        } else {
            name.push(NAME_PATTERNS['period.regularity'.toUpperCase()]);
        }

        const mrf = mrfId ? this.props.locations.find(location => location.id === mrfId) : null;
        if (mrf) {
            name.push(mrf.name);
        } else {
            name.push(NAME_PATTERNS['mrf'.toUpperCase()]);
        }
        name.push(`${type || NAME_PATTERNS['type'.toUpperCase()]}`);
        return name.join('_');
    };

    setConfigProperty = (key, value) => {
        const config = _.set({ ...this.state.config }, `${key}`, value);
        const removeKeys = [
            'name', key
        ];
        if (key === 'period.auto') {
            config.notify_users = value ? _.get('notify_users', []) : [];
        }

        if (_.get(config, 'period.auto')) {
            _.set(config, 'name', this.composeConfigName(
                _.get(config, 'template_id', null),
                _.get(config, 'period.regularity', null),
                _.get(config, 'type', null),
                _.get(config, 'mrf', null),
            ));
        }

        this.setState({
            config,
            errors: _.omit(this.state.errors, removeKeys),
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
            'name',
            ...(start ? ['period.start_date'] : []),
            ...(end ? ['period.end_date'] : []),
        ];
        const updatedRegularity = regularity.toUpperCase();
        this.setState({
            config: {
                ...this.state.config,
                name: this.composeConfigName(
                    _.get(this.state.config, 'template_id', null),
                    updatedRegularity,
                    _.get(this.state.config, 'type', null),
                    _.get(this.state.config, 'mrf', null),
                ),
                notify_users: auto ? _.get('notify_users', []) : [],
                period: {
                    regularity: updatedRegularity,
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
console.log(errors);
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
                                        labelText={ls('REPORTS_CONFIG_EDITOR_NAME_FIELD', 'Название')}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required
                                    >
                                        {!this.state.config.period.auto ? (
                                            <Input
                                                id="config-name"
                                                name="config-name"
                                                value={this.getConfigProperty('name')}
                                                onChange={value => this.setConfigProperty('name', value)}
                                                valid={!_.get(errors, 'name.title', false)}
                                                errorMessage={_.get(errors, 'name.title')}
                                            />
                                        ) : (
                                            <DisplayField className={styles.truncated_field}
                                                          title={this.getConfigProperty('name')}
                                                          error={_.get(errors, 'name')}
                                            >
                                                {this.getConfigProperty('name')}
                                            </DisplayField>
                                        )}
                                    </Field>
                                    <Field
                                        id="template-id"
                                        labelText={ls('REPORTS_CONFIG_EDITOR_TEMPLATE_FIELD', 'Шаблон')}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required
                                    >
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
                                    {/*<Field*/}
                                    {/*id="type"*/}
                                    {/*labelText={ls('REPORTS_CONFIG_EDITOR_TYPE_FIELD', 'Формат')}*/}
                                    {/*labelWidth="30%"*/}
                                    {/*inputWidth="70%"*/}
                                    {/*required*/}
                                    {/*>*/}
                                    {/*<Select*/}
                                    {/*id="type"*/}
                                    {/*options={REPORT_TYPE_OPTIONS}*/}
                                    {/*value={this.getConfigProperty('type')}*/}
                                    {/*placeholder={ls('REPORTS_CONFIG_EDITOR_TYPE_FIELD_PLACEHOLDER', 'Выберите формат отчета')}*/}
                                    {/*onChange={value => this.setConfigProperty('type', value)}*/}
                                    {/*valid={!_.get(errors, 'type', false)}*/}
                                    {/*errorMessage={_.get(errors, 'type.title')}*/}
                                    {/*noEmptyOption*/}
                                    {/*/>*/}
                                    {/*</Field>*/}
                                </Panel>
                                <Panel
                                    title={ls('REPORTS_CONFIG_EDITOR_MRF_TITLE', 'МРФ')}
                                >
                                    <Field
                                        id="mrf"
                                        labelText={ls('REPORTS_CONFIG_EDITOR_MRF_FIELD', 'МРФ')}
                                        labelWidth="30%"
                                        inputWidth="70%"
                                        required
                                    >
                                        <Select
                                            id="mrf"
                                            options={this.mapLocationOptions(this.props.locations)}
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
                                    templateId={this.getConfigProperty('template_id')}
                                    errors={_.get(errors, 'period', null)}
                                />
                                <Panel

                                    title={ls('REPORTS_CONFIG_EDITOR_ROLE_COMMENT_TITLE', 'Комментарий')}
                                >
                                    <Input
                                        type="textarea"
                                        value={this.getConfigProperty('comment')}
                                        onChange={value => this.setConfigProperty('comment', value)}
                                        rows={6}
                                    />
                                </Panel></div>
                            <div className={styles.configEditorColumn}>
                                <Panel
                                    title={ls('REPORTS_CONFIG_EDITOR_NOTIFY_USERS_TITLE', 'Рассылка для')}
                                    style={panelStyle}
                                    bodyStyle={panelBodyStyle}
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
