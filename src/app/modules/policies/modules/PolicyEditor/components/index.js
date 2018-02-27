import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import ls from 'i18n';
import Configuration from './Configuration';
import Condition from './Condition';
import styles from './styles.scss';

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        policyId: PropTypes.number,
        policy: PropTypes.object,
        active: PropTypes.bool,
        onSubmit: PropTypes.func,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        policyId: null,
        policy: null,
        active: false,
        onSubmit: () => null,
        onMount: () => null,
    };

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onClose = () => {
        this.context.history.push('/policies');
    }

    onSubmit = () => {
        console.log('onSubmit');
    }

    render() {
        const { active, policyId } = this.props;
        const modalTitle = policyId ? 'Редактировать политику' : 'Создать политику';
        return (
            <Modal isOpen={active} size="lg">
                <ModalHeader toggle={this.onClose}>{modalTitle}</ModalHeader>
                <ModalBody>
                    <div className={styles.roleEditorContent}>
                        <div className={styles.roleEditorColumn}>
                            <Configuration />
                            <div className={styles.panel}>
                                <h6>{ls('POLICIES_SCOPE_TITLE', 'Область применения')}</h6>
                                <Select
                                    type="select"
                                    placeholder={ls('POLICY_EDITOR_FIELD', 'Поле')}
                                    options={[]}
                                    onChange={() => {}}
                                />
                                <Select
                                    type="select"
                                    placeholder={ls('POLICY_EDITOR_FIELD', 'Поле')}
                                    options={[]}
                                    onChange={() => {}}
                                />
                            </div>
                            <div className={styles.panel}>
                                <h6>{ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}</h6>
                                <Row>
                                    <Col sm={6}>
                                        <Input
                                            name="interval"
                                            value={''}
                                            placeholder={ls('POLICY_EDITOR_AGREGATION_INTERVAL_FIELD', 'Интервал агрегации')}
                                            onChange={() => {}}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <Input
                                            name="threshold"
                                            value={''}
                                            placeholder={ls('POLICY_EDITOR_THRESHOLD_FIELD', 'Порог')}
                                            onChange={() => {}}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className={styles.roleEditorColumn}>
                            <Condition />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.onClose}>{ls('NEW_ROLE_CANCEL', 'Отмена')}</Button>
                    <Button color="primary" onClick={this.onSubmit}>{'ОК'}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default PolicyEditor;
