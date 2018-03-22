import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

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
        sourceOptions: PropTypes.array,
        subjectsData: PropTypes.array,
        subjectsByRole: PropTypes.object,
    };

    static defaultProps = {
        roleId: null,
        role: {},
        active: false,
        onSubmit: () => {
        },
        sourceOptions: [],
        subjectsData: [],
        subjectsByRole: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            role: props.roleId ? props.role : {},
        };
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.role !== nextProps.role) {
            const role = nextProps.role;
            role.subjects = this.subjectsToPermissions(role.subjects);
            this.setState({
                role,
            });
        }
    }

    setRoleProperty = (key, value) => {
        const role = {
            ...this.state.role,
            [key]: value,
        };
        this.setState({
            role,
        });
    };

    copySubjectsFromRole = (roleId) => {
        if (!_.isUndefined(roleId)) {
            let subjects = this.props.subjectsByRole[roleId];
            if (!_.isArray(subjects)) {
                subjects = [];
            }
            this.setRoleProperty('subjects', this.subjectsToPermissions(subjects))
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
        this.setState({ role: {} });
        this.context.history.push('/roles');
    };

    onCheck = (checkedIds) => {
        this.setRoleProperty('subjects', checkedIds);
    };

    getSourceOptions = sourceOptions => sourceOptions.map(opt => ({ value: opt[0], title: opt[1] }));

    render() {
        const { roleId, subjectsData, sourceOptions } = this.props;
        const { role } = this.state;
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
                                labelText={ls('NEW_ROLE_NAME_PLACEHOLDER', 'Имя роли:')}
                                required
                            >
                                <Input value={role.name}
                                       onChange={event => this.setRoleProperty('name', event.currentTarget.value)}
                                />
                            </Field>

                            <Field
                                labelText={ls('NEW_ROLE_COPY_SUBJECTS_FROM', 'Копировать разрешения из:')}
                            >
                                <Select type="select"
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
