import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Panel from '../../../../../components/Panel';
import PermissionList from './PermissionList'

import styles from './styles.scss';
import ls from "i18n";
import Field from "../../../../../components/Field/index";


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
            const role = nextProps.role;
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
                const subject = this.props.subjectsData.find(subj => subj.id === ids[0]);
                if (!result[subject.id]) {
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
            const levelIds = subj.access_level.map(lvl => `${subj.id}.${lvl}`);
            return result.concat(levelIds);
        }
        return result;
    }, []);

    onSubmit = () => {
        const role = this.state.role;
        role.subjects = this.permissionsToSubjects(role.subjects);
        this.props.onSubmit(this.props.roleId, role);
    };

    onClose = () => {
        this.context.history.push('/roles');
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
            >
                <ModalHeader
                    toggle={this.onClose}>{roleId ? ls('NEW_ROLE_EDIT', 'Редактирование роли') : ls('NEW_ROLE_ADD', 'Создание новой роли')}</ModalHeader>
                <ModalBody className={styles.modalBody}>
                    <div className={styles.roleEditorContent}>
                        <Panel
                            title={ls('ROLE_MAIN_INFO_PANEL_TITLE', 'Главная информация')}
                        >
                            <Field
                                id="name"
                                labelText={ls('NEW_ROLE_NAME_PLACEHOLDER', 'Имя роли:')}
                                labelWidth="50%"
                                inputWidth="50%"
                                required
                            >
                                <Input
                                    id="name"
                                    value={role.name}
                                    onChange={event => this.setRoleProperty('name', event.currentTarget.value)}
                                    valid={errors && _.isEmpty(errors.name)}
                                />
                            </Field>

                            <Field
                                id="permissions-source"
                                labelText={ls('NEW_ROLE_COPY_SUBJECTS_FROM', 'Копировать разрешения из:')}
                                labelWidth="50%"
                                inputWidth="50%"
                            >
                                <Select
                                    id="permissions-source"
                                    type="select"
                                    value={this.state.selectedRoleId}
                                    options={this.getSourceOptions(filteredSourceOptions)}
                                    onChange={this.copySubjectsFromRole}
                                />
                            </Field>
                        </Panel>
                        <Panel
                            title={ls('ROLE_PERMISSIONS_PANEL_TITLE', 'Разрешения')}
                            style={{ height: 370 }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <PermissionList subjectsData={subjectsData}
                                            onCheck={this.onCheck}
                                            checked={role.subjects || []}
                            />
                        </Panel>
                        <Panel
                            title={ls('ROLE_COMMENT_PANEL_TITLE', 'Комментарий')}
                        >
                            <Input type="textarea"
                                   value={role.description}
                                   onChange={event => this.setRoleProperty('description', event.currentTarget.value)}
                                   rows={6}
                            />
                        </Panel>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="action" onClick={this.onClose}>
                        {ls('NEW_ROLE_CANCEL', 'Отмена')}
                    </Button>
                    <Button color="action" onClick={this.onSubmit}>
                        {roleId ? ls('NEW_ROLE_UPDATE', 'Обновить') : ls('NEW_ROLE_CREATE', 'Создать')}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default RoleEditor;
