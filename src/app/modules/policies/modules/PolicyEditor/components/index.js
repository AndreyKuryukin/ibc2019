import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import ls from 'i18n';
import Configuration from './Configuration';
import Condition from './Condition';
import styles from './styles.scss';
import DraggableWrapper from "../../../../../components/DraggableWrapper/index";

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        policyId: PropTypes.number,
        policy: PropTypes.object,
        scopes: PropTypes.array,
        types: PropTypes.array,
        active: PropTypes.bool,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        policyId: null,
        policy: null,
        scopes: [],
        types: [],
        active: false,
        onSubmit: () => null,
        onClose: () => null,
        onMount: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            policy: props.policy,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.policy !== nextProps.policy) {
            this.setState({
                policy: nextProps.policy,
            });
        }
    }

    getPolicyProperty = (key, defaultValue) => _.get(this.state.policy, key, defaultValue);

    setPolicyProperty = (key, value) => {
        const policyValues = _.set({}, key, value);
        const policy = _.merge(
            {},
            this.state.policy,
            policyValues,
        );
        this.setState({
            policy,
        });
    };

    onClose = () => {
        this.context.history.push('/policies');
        this.props.onClose();
    };

    onSubmit = () => {
        if (typeof this.props.onSubmit === 'function') {
            // this.props.onSubmit(this.props.userId, this.state.user);
            this.props.onSubmit(this.props.policyId, this.state.policy);
        }
    };

    mapScopes = (scopes) => {
        return scopes.map(scope => ({ value: scope, title: scope }))
    };

    render() {
        const { active, policyId, scopes, types } = this.props;
        const { policy } = this.state;
        console.log(policy);
        const modalTitle = policyId
            ? ls('POLICIES_EDIT_POLICY_TITLE', 'Редактировать политику')
            : ls('POLICIES_CREATE_POLICY_TITLE', 'Создать политику');
        return (
            <DraggableWrapper>
            <Modal
                isOpen={active}
                className={styles.policyEditor}
            >
                <ModalHeader toggle={this.onClose} className="handle">{modalTitle}</ModalHeader>
                <ModalBody>
                    <div className={styles.policyEditorContent}>
                        <div className={styles.policyEditorColumn}>
                            <Configuration
                                getPolicyProperty={(key, defaultValue) => this.getPolicyProperty(key, defaultValue)}
                                setPolicyProperty={(key, value) => this.setPolicyProperty(key, value)}
                                types={types}
                                policy={policy}
                            />
                            <Panel
                                title={ls('POLICIES_SCOPE_TITLE', 'Область применения')}
                            >
                                <Field
                                    id="iField"
                                    inputWidth="100%"
                                >
                                    <Select
                                        id="iField"
                                        type="select"
                                        options={this.mapScopes(scopes)}
                                        value={this.getPolicyProperty('scope_type')}
                                        onChange={scope_type => this.setPolicyProperty('scope_type', scope_type)}
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
                                        onChange={() => {
                                        }}
                                    />
                                </Field>
                            </Panel>
                            <Panel
                                title={ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}
                            >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ width: '70%' }}>
                                        <Field
                                            id="cease_duration"
                                            labelText={ls('POLICIES_ADD', 'Создать политику')}
                                            labelWidth="67%"
                                            inputWidth="33%"
                                        >
                                            <Input
                                                id="cease_duration"
                                                name="cease_duration"
                                                value={this.getPolicyProperty('threshold.cease_duration')}
                                                onChange={event => this.setPolicyProperty('threshold.cease_duration', _.get(event, 'target.value'))}
                                            />
                                        </Field>
                                    </div>
                                    <div style={{ width: '30%' }}>
                                        <Field
                                            id="cease_value"
                                            labelText={`${ls('POLICIES_POLICY_FIELD_CEASE_VALUE', 'Порог')}:`}
                                        >
                                            <Input
                                                id="cease_value"
                                                name="cease_value"
                                                type="number"
                                                value={this.getPolicyProperty('threshold.cease_value')}
                                                onChange={event => this.setPolicyProperty('threshold.cease_value', _.get(event, 'target.value'))}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </Panel>
                        </div>
                        <div className={styles.policyEditorColumn}>
                            <Condition
                                condition={this.getPolicyProperty('condition')}
                                onChange={condition => this.setPolicyProperty('condition', condition)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="action" onClick={this.onClose}>{ls('NEW_ROLE_CANCEL', 'Отмена')}</Button>
                    <Button color="action" onClick={this.onSubmit}>{ls('POLICIES_SUBMIT', 'Сохранить')}</Button>
                </ModalFooter>
            </Modal>
            </DraggableWrapper>
        );
    }
}

export default PolicyEditor;
