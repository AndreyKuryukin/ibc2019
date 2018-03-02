import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
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

    constructor(props) {
        super(props);
        this.state = {
            policy: props.policy || {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.policy, this.props.policy)) {
            this.setState({policy: nextProps.policy});
        }
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onClose = () => {
        this.context.history.push('/policies');
    };

    onSubmit = () => {
        console.log(this.state);
        this.props.onSubmit(this.state.policy);
    };

    setPolicyProperty = (path, value) => {
        const policy = _.set(this.state.policy, path, value);
        this.setState({policy});
    };

    render() {
        const { active, policyId } = this.props;
        const {policy} = this.state;
        const modalTitle = policyId ? 'Редактировать политику' : 'Создать политику';
        return (
            <Modal isOpen={active} size="lg">
                <ModalHeader toggle={this.onClose}>{modalTitle}</ModalHeader>
                <ModalBody>
                    <div className={styles.roleEditorContent}>
                        <div className={styles.roleEditorColumn}>

                            <div className={styles.panel}>
                                <h6 className={styles.panelHeader}>{ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}</h6>
                                <div className={styles.panelBody}>
                                    <Field
                                        id="name"
                                        labelText="Имя:"
                                    >
                                        <Input
                                            id="name"
                                            name="name"
                                            value={_.get(policy, 'name')}
                                            onChange={(e) => this.setPolicyProperty('name', e.currentTarget.value)}
                                        />
                                    </Field>
                                    <Field
                                        id="agregation"
                                        labelText="Фукнция агрегации:"
                                        required
                                    >
                                        <Select
                                            id="agregation"
                                            type="select"
                                            options={[]}
                                            onChange={() => {
                                            }}
                                        />
                                    </Field>
                                    <Row>
                                        <Col sm={6}>
                                            <Field
                                                id="interval"
                                                labelText="Интервал агрегации:"
                                            >
                                                <Input
                                                    id="interval"
                                                    name="interval"
                                                    type="number"
                                                    value={_.get(policy, 'threshold.rise_duration')}
                                                    onChange={(e) => this.setPolicyProperty('threshold.rise_duration', e.currentTarget.value)}
                                                />
                                            </Field>
                                        </Col>
                                        <Col sm={6}>
                                            <Field
                                                id="threshold"
                                                labelText="Порог:"
                                            >
                                                <Input
                                                    id="threshold"
                                                    name="threshold"
                                                    type="number"
                                                    value={_.get(policy, 'threshold.rise_value')}
                                                    onChange={(e) => this.setPolicyProperty('threshold.rise_value', e.currentTarget.value)}

                                                />
                                            </Field>
                                        </Col>
                                    </Row>
                                    <Field
                                        id="message"
                                        labelText="Текст сообщения:"
                                        labelWidth="100%"
                                        inputWidth="100%"
                                        labelAlign="right"
                                    >
                                        <Input
                                            id="message"
                                            type="textarea"
                                            value={_.get(policy, 'threshold.notification_template')}
                                            onChange={(e) => this.setPolicyProperty('threshold.notification_template', e.currentTarget.value)}
                                        />
                                    </Field>
                                </div>
                            </div>

                            <div className={styles.panel}>
                                <h6 className={styles.panelHeader}>{ls('POLICIES_SCOPE_TITLE', 'Область применения')}</h6>
                                <div className={styles.panelBody}>
                                    <Field
                                        id="iField"
                                        inputWidth="100%"
                                    >
                                        <Select
                                            id="iField"
                                            type="select"
                                            options={[]}
                                            onChange={() => {}}
                                        />
                                    </Field>
                                    <Field
                                        id="jField"
                                        inputWidth="100%"
                                    >
                                        <Select
                                            id="jField"
                                            type="select"
                                            options={[]}
                                            onChange={() => {}}
                                        />
                                    </Field>
                                </div>
                            </div>
                            <div className={styles.panel}>
                                <h6 className={styles.panelHeader}>{ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}</h6>
                                <div className={styles.panelBody}>
                                    <Row>
                                        <Col sm={6}>
                                            <Field
                                                id="interval"
                                                labelText="Интервал агрегации:"
                                            >
                                                <Input
                                                    id="interval"
                                                    name="interval"
                                                    type="number"
                                                    value={_.get(policy, 'threshold.cease_duration')}
                                                    onChange={(e) => this.setPolicyProperty('threshold.cease_duration', e.currentTarget.value)}
                                                />
                                            </Field>
                                        </Col>
                                        <Col sm={6}>
                                            <Field
                                                id="threshold"
                                                labelText="Порог:"
                                            >
                                                <Input
                                                    id="threshold"
                                                    name="threshold"
                                                    type="number"
                                                    value={_.get(policy, 'threshold.cease_value')}
                                                    onChange={(e) => this.setPolicyProperty('threshold.cease_value', e.currentTarget.value)}
                                                />
                                            </Field>
                                        </Col>
                                    </Row>
                                </div>
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
