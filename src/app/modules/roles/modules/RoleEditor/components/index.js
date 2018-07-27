import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Panel from '../../../../../components/Panel';
import PermissionList from './PermissionList'

import styles from './styles.scss';
import ls from "i18n";
import Field from "../../../../../components/Field/index";
import Modal from "../../../../../components/Modal/index";

const permissionsTableStyle = { height: 370, zIndex: 0 };
const permissionsTableBodyStyle = { padding: 0 };

class RoleEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        roleId: PropTypes.string,
        role: PropTypes.object.isRequired,
        active: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
        onClose: PropTypes.func,
        sourceOptions: PropTypes.array,
        subjectsData: PropTypes.array,
        subjectsByRole: PropTypes.object,
        errors: PropTypes.object,
    };

    static defaultProps = {
        roleId: null,
        role: {},
        active: false,
        onSubmit: () => null,
        onClose: () => null,
        sourceOptions: [],
        subjectsData: [],
        subjectsByRole: {},
        errors: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            role: props.role,
            errors: props.errors,
        };
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.role !== nextProps.role) {
            const role = this.props.roleId ? nextProps.role : this.state.role;
            role.subjects = this.subjectsToPermissions(role.subjects);
            this.setState({
                role,
                selectedRoleId: '',
            });
        }

        if (this.state.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    setRoleProperty = (key, value) => {
        const role = {
            ...this.state.role,
            [key]: value,
        };
        this.setState({
            role,
            errors: _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors,
        });
    };

    copySubjectsFromRole = (roleId) => {
        if (!_.isUndefined(roleId)) {
            let subjects = this.props.subjectsByRole[roleId];
            if (!_.isArray(subjects)) {
                subjects = [];
            }
            this.setState({ selectedRoleId: roleId }, () => {
                this.setRoleProperty('subjects', this.subjectsToPermissions(subjects))
            });
        } else {
            this.setRoleProperty('subjects', [])
        }
    };

    permissionsToSubjects = (subjects) => {
        const resultSubjects = _.reduce(subjects, (result, id) => {
            const ids = id.split('.');
            if (ids.length > 1) {
                const subject = this.props.subjectsData.find(subj => subj.name.toUpperCase() === ids[0]);
                if (subject && !result[subject.id]) {
                    subject['access_level'] = [];
                    result[subject.id] = _.omit(subject, ['isLast', 'children']);
                }
                result[subject.id]['access_level'].push(ids[1]);
                return result
            }
            return result;
        }, {});
        return _.values(resultSubjects);
    };

    subjectsToPermissions = subjects => _.reduce(subjects, (result, subj) => {
        if (!_.isEmpty(subj.access_level)) {
            const levelIds = subj.access_level.map(lvl => `${subj.name}.${lvl}`);
            return result.concat(levelIds);
        }
        return result;
    }, []);

    onSubmit = () => {
        const role = this.state.role;
        this.props.onSubmit(this.props.roleId, { ...role, subjects: this.permissionsToSubjects(role.subjects) });
    };

    onClose = () => {
        this.context.history.push('/users-and-roles/roles');
        this.props.onClose();
    };

    onCheck = (checkedIds) => {
        this.setState({
            selectedRoleId: '',
        }, () => {
            this.setRoleProperty('subjects', checkedIds);
        });
    };

    getSourceOptions = sourceOptions => sourceOptions.map(opt => ({ value: opt[0], title: opt[1] }));

    render() {
        const { roleId, subjectsData, sourceOptions } = this.props;
        const { role, errors } = this.state;
        const filteredSourceOptions = roleId ? sourceOptions.filter(opt => opt[0] !== roleId) : sourceOptions;

        return (
                <Modal
                    isOpen={this.props.active}
                    className={styles.roleEditor}
                    title={roleId ? ls('NEW_ROLE_EDIT', 'Редактирование роли') + ' ' + _.get(this.props.role, 'name', '') : ls('NEW_ROLE_ADD', 'Создание новой роли')}
                    submitTitle={roleId ? ls('SAVE', 'Сохранить') : ls('CREATE', 'Создать')}
                    cancelTitle={ls('CANCEL', 'Отмена')}
                    onClose={this.onClose}
                    onSubmit={this.onSubmit}
                >
                        <div className={styles.roleEditorContent}>
                            <Panel
                                title={ls('ROLE_MAIN_INFO_PANEL_TITLE', 'Главная информация')}
                            >
                                <Field
                                    id="name"
                                    labelText={ls('NEW_ROLE_NAME_LABEL', 'Имя роли')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                    required
                                >
                                    <Input
                                        id="name"
                                        value={role.name || ''}
                                        onChange={value => this.setRoleProperty('name', value)}
                                        valid={errors && _.isEmpty(errors.name)}
                                        errorMessage={_.get(errors, 'name.title')}
                                        placeholder={ls('NEW_ROLE_NAME_PLACEHOLDER', 'Имя роли')}
                                        maxLength={255}
                                    />
                                </Field>

                                <Field
                                    id="permissions-source"
                                    labelText={ls('NEW_ROLE_COPY_SUBJECTS_FROM', 'Копировать разрешения из')}
                                    labelWidth="50%"
                                    inputWidth="50%"
                                >
                                    <Select
                                        id="permissions-source"
                                        type="select"
                                        value={this.state.selectedRoleId}
                                        options={this.getSourceOptions(filteredSourceOptions)}
                                        onChange={this.copySubjectsFromRole}
                                        placeholder={ls('NEW_ROLE_COPY_SUBJECTS_FROM_PLACEHOLDER', 'Роль')}
                                    />
                                </Field>
                            </Panel>
                            <Panel
                                title={ls('ROLE_PERMISSIONS_PANEL_TITLE', 'Разрешения')}
                                style={permissionsTableStyle}
                                bodyStyle={permissionsTableBodyStyle}
                            >
                                <PermissionList subjectsData={subjectsData}
                                                onCheck={this.onCheck}
                                                checked={role.subjects || []}
                                />
                            </Panel>
                            <Panel
                                title={ls('ROLE_COMMENT_PANEL_TITLE', 'Описание')}
                            >
                                <Input
                                    type="textarea"
                                    value={role.description || ''}
                                    onChange={value => this.setRoleProperty('description', value)}
                                    rows={6}
                                    placeholder={ls('ROLE_COMMENT_PLACEHOLDER', 'Описание')}
                                    maxLength={255}
                                />
                            </Panel>
                        </div>
                </Modal>
        );
    }
}

export default RoleEditor;
