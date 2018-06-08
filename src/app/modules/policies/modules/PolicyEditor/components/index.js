import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import memoize from 'memoizejs';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import Checkbox from '../../../../../components/Checkbox';
import ls from 'i18n';
import Configuration from './Configuration';
import Condition from './Condition';
import styles from './styles.scss';
import DraggableWrapper from "../../../../../components/DraggableWrapper/index";
import Preloader from "../../../../../components/Preloader";

const notAllowedAccidentStyle = { width: '60%' };

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        policyId: PropTypes.number,
        policy: PropTypes.object,
        errors: PropTypes.object,
        scopes: PropTypes.array,
        policyTypes: PropTypes.array,
        objectTypes: PropTypes.array,
        metaData: PropTypes.object,
        policies: PropTypes.array,
        active: PropTypes.bool,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        onMount: PropTypes.func,
        updatePolicy: PropTypes.func,
        fetchObjectTypes: PropTypes.func,
        fetchPolicyTypes: PropTypes.func,
        fetchMetaData: PropTypes.func,
    };

    static defaultProps = {
        policyId: null,
        policy: {},
        errors: null,
        scopes: [],
        policyTypes: [],
        objectTypes: [],
        metaData: {},
        policies: [],
        active: false,
        onSubmit: () => null,
        onClose: () => null,
        onMount: () => null,
        updatePolicy: () => null,
        fetchObjectTypes: () => null,
        fetchPolicyTypes: () => null,
        fetchMetaData: () => null
    };

    constructor(props) {
        super(props);

        this.state = {
            policy: props.policy,
            errors: null,
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
        if (nextProps.metaData !== this.props.metaData) {
            this.setState({ metaData: nextProps.metaData })
        }

        if (this.state.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    handleObjectTypeChange = (prevPolicy, objectType) => {
        const policy = _.pick(prevPolicy, ['name', 'objectType']);
        policy['objectType'] = objectType;
        policy['condition'] = { condition: {} };
        this.setState({ metaData: {} }, () => {
            this.props.fetchPolicyTypes(policy.objectType);
        });
        return policy
    };

    handlePolicyTypeChange = (prevPolicy, policy_type) => {
        const policy = _.pick(prevPolicy, ['name', 'object_type', 'policy_type']);
        policy['policy_type'] = policy_type;
        policy['condition'] = { condition: {} };
        this.setState({ metaData: {} }, () => {
            this.props.fetchMetaData(policy.object_type, policy.policy_type);
        });
        return policy
    };

    getPolicyProperty = (key, defaultValue) => _.get(this.state.policy, key, defaultValue);

    setPolicyProperty = (key, value) => {
        const policyValues = _.set({}, key, value);
        let prevPolicy = this.state.policy;
        if (key === 'object_type') {
            prevPolicy = this.handleObjectTypeChange(prevPolicy, value)
        }
        if (key === 'policy_type') {
            prevPolicy = this.handlePolicyTypeChange(prevPolicy, value)
        }
        const policy = _.merge(
            {},
            prevPolicy,
            policyValues,
        );

        this.setState({
            errors: key.indexOf('condition') === -1 ? _.omit(this.state.errors, key) : this.state.errors,
        }, () => {
            this.props.updatePolicy(policy)
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

    mapPolicies = memoize((policies, policyId) =>
        policies
            .filter(policy => policy.id !== policyId)
            .map(policy => ({ value: policy.id, title: policy.name })));

    getSeconds = (mills) => {
        return moment.duration(mills, 'milliseconds').asSeconds() || '';
    };

    getMilliSeconds = (secs) => {
        return moment.duration(Number(secs), 'seconds').asMilliseconds();
    };

    render() {
        const { active, policyId, scopes, policyTypes, policies, objectTypes } = this.props;
        const { policy, errors, metaData } = this.state;
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
                        <Preloader active={this.props.loading}>
                            <div className={styles.policyEditorContent}>
                                <div className={styles.policyEditorColumn}>
                                    <Configuration
                                        getPolicyProperty={(key, defaultValue) => this.getPolicyProperty(key, defaultValue)}
                                        setPolicyProperty={(key, value) => this.setPolicyProperty(key, value)}
                                        policyTypes={policyTypes}
                                        objectTypes={objectTypes}
                                        metaData={metaData}
                                        policy={policy}
                                        errors={errors}
                                    />
                                    <Panel
                                        title={ls('POLICIES_SCOPE_TITLE', 'Область применения')}
                                    >
                                        <Field
                                            id="scope-type"
                                            inputWidth="100%"
                                            splitter=""
                                        >
                                            <Select
                                                id="scope-type"
                                                type="select"
                                                options={this.mapScopes(scopes)}
                                                value={this.getPolicyProperty('scope_type')}
                                                onChange={scope_type => this.setPolicyProperty('scope_type', scope_type)}
                                            />
                                        </Field>
                                        <Field
                                            id="scope"
                                            inputWidth="100%"
                                            splitter=""
                                        >
                                            <Select
                                                id="scope"
                                                type="select"
                                                options={[]}
                                                onChange={() => null}
                                            />
                                        </Field>
                                    </Panel>
                                    <Panel
                                        title={ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <div style={{ flex: 3 }}>
                                                <Field
                                                    id="cease_duration"
                                                    labelText={ls('POLICIES_ADD', 'Интервал агрегации')}
                                                    labelWidth="67%"
                                                    inputWidth="33%"
                                                    required
                                                >
                                                    <div style={{ display: 'flex' }}>
                                                        <Input
                                                            id="cease_duration"
                                                            name="cease_duration"
                                                            valid={_.isEmpty(_.get(errors, 'threshold.cease_duration'))}
                                                            value={this.getSeconds(this.getPolicyProperty('threshold.cease_duration'))}
                                                            onChange={event => this.setPolicyProperty('threshold.cease_duration', this.getMilliSeconds(_.get(event, 'target.value')))}
                                                        />
                                                        <span
                                                            style={{ margin: '2px' }}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                                                    </div>
                                                </Field>
                                            </div>
                                            <div style={{ flex: 2 }}>
                                                {_.get(metaData, 'group') !== 'SIMPLE' && <Field
                                                    id="cease_value"
                                                    labelText={`${ls('POLICIES_POLICY_FIELD_CEASE_VALUE', 'Порог')}`}
                                                    labelWidth="50%"
                                                    inputWidth="50%"
                                                    required
                                                >
                                                    <div style={{ display: 'flex' }}>
                                                        <Input
                                                            id="cease_value"
                                                            name="cease_value"
                                                            type="number"
                                                            valid={_.isEmpty(_.get(errors, 'threshold.cease_value'))}
                                                            value={this.getSeconds(this.getPolicyProperty('threshold.cease_value'))}
                                                            onChange={event => this.setPolicyProperty('threshold.cease_value', this.getMilliSeconds(_.get(event, 'target.value')))}
                                                        />
                                                        <span
                                                            style={{ margin: '2px' }}>{ls('TRESHOLD_UNIT', 'ед.')}</span>
                                                    </div>
                                                </Field>}
                                            </div>
                                        </div>
                                    </Panel>
                                </div>
                                <div className={styles.policyEditorColumn}>
                                    <Condition
                                        condition={this.getPolicyProperty('condition')}
                                        parameters={_.get(this.state, 'metaData.parameters')}
                                        onChange={condition => this.setPolicyProperty('condition', condition)}
                                        errors={errors && _.get(errors, 'condition.condition')}
                                    />
                                </div>
                                {!_.isEmpty(this.state.metaData) &&
                                    (_.get(this.props, 'metaData.channel_suppression', false) ||
                                    _.get(this.props, 'metaData.hierarchy_suppression', false)) &&
                                <Panel
                                    title={ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}
                                    className={styles.accidentsPanel}
                                >

                                    {_.get(this.props, 'metaData.channel_suppression', false) &&
                                    <Field
                                        id="exclude-tv"
                                        labelText={ls('POLICIES_EXCLUDE_TV_CHANNELS_FIELD', 'Исключать данные по ТВ каналам, на которых фиксировались ошибки на ГС/ЦГС')}
                                        labelWidth="97%"
                                        inputWidth="3%"
                                        labelAlign="right"
                                        splitter=""
                                        title={ls('POLICIES_EXCLUDE_TV_CHANNELS_FIELD', 'Исключать данные по ТВ каналам, на которых фиксировались ошибки на ГС/ЦГС')}
                                    >
                                        <Checkbox
                                            id="exclude-tv"
                                            checked={this.getPolicyProperty('exclude_tv')}
                                            onChange={value => this.setPolicyProperty('exclude_tv', value)}
                                        />
                                    </Field>}
                                    {
                                        _.get(this.props, 'metaData.hierarchy_suppression', false) &&
                                        < Field
                                            id="allow-accident"
                                            labelText={`${ls('POLICIES_ALLOW_ACCIDENT_FIELD', 'Не поднимать аварию при наличии следующих типов аварий на вышестоящих элементах')}`}
                                            labelWidth="97%"
                                            inputWidth="3%"
                                            labelAlign="right"
                                            splitter=""
                                            title={ls('POLICIES_ALLOW_ACCIDENT_FIELD', 'Не поднимать аварию при наличии следующих типов аварий на вышестоящих элементах')}
                                        >
                                            <Checkbox
                                                id="allow-accident"
                                                checked={this.getPolicyProperty('allow_accident')}
                                                onChange={value => this.setPolicyProperty('allow_accident', value)}
                                            />
                                        </Field>}
                                    {
                                        _.get(this.props, 'metaData.hierarchy_suppression', false) &&
                                        < Field
                                            id="not-allowed-accident"
                                            inputWidth="100%"
                                            splitter=""
                                            style={notAllowedAccidentStyle}
                                        >
                                            <Select
                                                id="not-allowed-accident"
                                                type="select"
                                                options={this.mapPolicies(policies, policyId)}
                                                value={this.getPolicyProperty('accident')}
                                                onChange={value => this.setPolicyProperty('accident', value)}
                                            />
                                        </Field>}
                                    {
                                        _.get(this.props, 'metaData.hierarchy_suppression', false) &&
                                        <Field
                                            id="waiting-time"
                                            labelText={ls('POLICIES_WAITING_TIME_OF_ACCIDENT', 'Время ожидания вышестоящей аварии')}
                                            labelWidth="66%"
                                            inputWidth="34%"
                                            style={notAllowedAccidentStyle}
                                        >
                                            <Input
                                                id="waiting-time"
                                                name="waiting-time"
                                                type="number"
                                                value={this.getPolicyProperty('waiting_time')}
                                                onChange={event => this.setPolicyProperty('waiting_time', _.get(event, 'target.value'))}
                                            />
                                        </Field>
                                    }
                                </Panel>
                                }
                            </div>
                        </Preloader>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="action"
                                onClick={this.onClose}>{ls('NEW_ROLE_CANCEL', 'Отмена')}</Button>
                        <Button color="action" onClick={this.onSubmit}>{ls('POLICIES_SUBMIT', 'Сохранить')}</Button>
                    </ModalFooter>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default PolicyEditor;
