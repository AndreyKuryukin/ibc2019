import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Select from '../../../../../components/Select';

import styles from './styles.scss';
import ls from "i18n";

const EMPTY_OPTION = ['', ''];
const textInputStyle = {
    background: '#000',
    border: 0,
    color: '#fff',
    padding: '0 5px',
};


class RoleEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

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
        };
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

    onClose = () => {
        this.context.history.push('/roles');
    }

    render() {

        const { roleId, onFetchSubjectsSuccess, subjectsData } = this.props;
        return (
            <Modal isOpen={this.props.active}>
                <ModalHeader
                    toggle={this.onClose}>{roleId ? 'Редактирование роли' : 'Создание новой роли'}</ModalHeader>
                <ModalBody className={styles.modalBody}>
                    <Input placeholder={ls('NEW_ROLE_NAME_PLACEHOLDER', 'Имя роли')}/>
                    <Select type="select"
                            placeholder={ls('NEW_ROLE_COPY_SUBJECTS_FROM', 'Копировать разрешения из')}
                            options={[{value: 1, title: 'erere'}]}
                    />
                    <Input type="textarea" placeholder={ls('NEW_ROLE_COMMENT_PLACEHOLDER', 'Комментарий')}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.onClose}>{ls('NEW_ROLE_CANCEL', 'Отмена')}</Button>
                    <Button color="primary">{ls('NEW_ROLE_SUBMIT', 'Создать')}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default RoleEditor;
