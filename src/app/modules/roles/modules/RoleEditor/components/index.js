import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal, Panel, Field, TextInput, TextInputTypeahead, Select } from 'qreact';
import RolesListGrid from '../containers/RolesListGrid';

import styles from './styles.scss';

const EMPTY_OPTION = ['', ''];

class RoleEditor extends React.PureComponent {
    static propTypes = {
        roleId: PropTypes.number,
        role: PropTypes.object.isRequired,
        active: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
        sourceOptions: PropTypes.array,
        subjectsByRole: PropTypes.object,
    };

    static defaultProps = {
        roleId: null,
        active: false,
        sourceOptions: [],
        subjectsByRole: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            role: props.role,
        }
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.role !== nextProps.role) {
            this.setState({
                role: nextProps.role,
            });
        }
    }

    getRoleProperty = (key, defaultValue) => _.get(this.state.role, key, defaultValue);

    setRoleProperty = (key, value) => {
        const role = {
            ...this.state.role,
            [key]: value,
        };

        if (key === 'source') {
            role.subjects = _.get(this.props.subjectsByRole, `${value}`, role.subjects);
        }

        this.setState({
            role,
        });
    }

    onSubmit = () => {
        if (typeof this.props.onSubmit === 'function') {
            const role = {
                ...this.state.role,
            };
            delete role.source;
            this.props.onSubmit(this.props.roleId, role);
        }
    }

    render() {
        return (
            <Modal
                title="Создание новой роли"
                width={400}
                onSubmit={this.onSubmit}
                onCancel={() => {}}
                onClose={() => {}}
                submitLabel="ОК"
                cancelLabel="Отменить"
                bodyStyle={{ overflow: 'visible' }}
                submitDisabled={false}
                cancelDisabled={false}
                active={this.props.active}
            >
                <Panel
                    title="Главная информация"
                    vertical
                    noScroll
                >
                    <Field
                        id="name"
                        label="Имя роли"
                        labelWidth={200}
                        className={styles.field}
                    >
                        <TextInput
                            id="name"
                            name="name"
                            value={this.getRoleProperty('name', '')}
                            onChange={value => this.setRoleProperty('name', value)}
                        />
                    </Field>
                    <Field
                        id="source"
                        label="Копировать разрешение из"
                        labelWidth={200}
                        className={styles.field}
                    >
                        <Select
                            id="source"
                            options={[EMPTY_OPTION, ...this.props.sourceOptions]}
                            value={this.getRoleProperty('source', '')}
                            onChange={value => this.setRoleProperty('source', value)}
                        />
                    </Field>
                </Panel>
                <Panel
                    title="Разрешения"
                    vertical
                    noScroll
                    style={{ height: 300 }}
                >
                    <RolesListGrid
                        checked={this.getRoleProperty('subjects')}
                        onCheckRows={ids => this.setRoleProperty('subjects', ids)}
                    />
                </Panel>
                <Panel
                    title="Комментарий"
                    vertical
                    noScroll
                >
                    <TextInputTypeahead
                        id="role-comment"
                        className={styles.textarea}
                        value={this.getRoleProperty('description', '')}
                        onChange={value => this.setRoleProperty('description', value)}
                        maxlength={255}
                        multiline
                        rows={6}
                    />
                </Panel>
            </Modal>
        );
    }
}

export default RoleEditor;
