import React, { Fragment } from 'react';
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
import ConfirmDialog from '../../../../../components/ConfirmDialog';
import MacList from "./MacList";
import KqiList from "./KqiList";
import Scope from './Scope';

const notAllowedAccidentStyle = { width: '60%' };
const unitStyle = { margin: '3px 0px 3px 2px' };
const thresholdFieldStyle = { flexGrow: 1, justifyContent: 'flex-end' };

const defaultCondition = {
    conditionDuration: '',
    conjunction: {
        type: 'AND',
        conjunctionList: [],
    },
};

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        policyId: PropTypes.string,
        policy: PropTypes.object,
        errors: PropTypes.object,
        scopes: PropTypes.array,
        policyTypes: PropTypes.array,
        objectTypes: PropTypes.array,
        metaData: PropTypes.object,
        policies: PropTypes.array,
        mrfList: PropTypes.array,
        active: PropTypes.bool,
        alertsCount: PropTypes.number,
        onSubmit: PropTypes.func,
        onTest: PropTypes.func,
        onClose: PropTypes.func,
        onMount: PropTypes.func,
        updatePolicy: PropTypes.func,
        fetchObjectTypes: PropTypes.func,
        fetchPolicyTypes: PropTypes.func,
        fetchMetaData: PropTypes.func,
        clearAlerts: PropTypes.func,
    };

    static defaultProps = {
        policyId: '',
        policy: {},
        errors: null,
        scopes: [],
        policyTypes: [],
        objectTypes: [],
        metaData: {},
        policies: [],
        mrfList: [],
        active: false,
        alertsCount: 0,
        onSubmit: () => null,
        onTest: () => null,
        onClose: () => null,
        onMount: () => null,
        updatePolicy: () => null,
        fetchObjectTypes: () => null,
        fetchPolicyTypes: () => null,
        fetchMetaData: () => null,
        clearAlerts: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            policy: props.policy,
            errors: null,
        };
    }

    componentDidMount() {
        const closeBtn = document.querySelector(`.${styles.policyEditor} .close`);

        if (closeBtn) {
            closeBtn.setAttribute('itemId', 'policies_close');
        }

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

        if (this.props.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    handleObjectTypeChange = (prevPolicy, objectType) => {
        const policy = _.pick(prevPolicy, ['name', 'object_type']);
        policy['object_type'] = objectType;
        policy['condition'] = { condition: defaultCondition };
        policy['scopes'] = {};
        if (objectType === 'KQI') {
            policy['threshold'] = {
                cease_duration: 0,
                cease_value: 0,
                rise_duration: 0,
                rise_value: 0
            };
        }
        this.setState({ metaData: {} }, () => {
            this.props.fetchPolicyTypes(policy.object_type);
        });
        return policy;
    };

    handlePolicyTypeChange = (prevPolicy, policy_type) => {
        const policy = _.pick(prevPolicy, ['name', 'object_type', 'policy_type', 'threshold']);
        policy['policy_type'] = policy_type;
        policy['condition'] = { condition: defaultCondition };
        policy['scopes'] = {};
        this.setState({ metaData: {} }, () => {
            this.props.fetchMetaData(policy.object_type, policy.policy_type);
        });
        return policy;
    };

    getPolicyProperty = (key, defaultValue) => _.get(this.state.policy, key, defaultValue);

    setPolicyProperty = (key, value, errorKey) => {
        const policyValues = _.set({}, key, value);
        let prevPolicy = _.cloneDeep(this.state.policy);

        if (key === 'object_type') {
            prevPolicy = this.handleObjectTypeChange(prevPolicy, value);
        }

        if (key === 'policy_type') {
            prevPolicy = this.handlePolicyTypeChange(prevPolicy, value);
        }

        if (key === 'allow_accident' && value === false) {
            _.set(policyValues, 'parent_policy', '');
            _.set(policyValues, 'suppression_timeout', '');
        }

        if ((key === 'threshold.cease_value' || key === 'threshold.rise_value') && _.get(prevPolicy, 'object_type', '') !== 'STB') {
            _.set(policyValues, key, this.getMilliSeconds(value));
        }

        const policy = _.mergeWith(
            prevPolicy,
            policyValues,
            (objValue, srcValue) => {
                if (_.isArray(srcValue)) {
                    return srcValue;
                } else if (_.isObject(srcValue)) {
                    return key !== 'scopes' ? _.merge(objValue, srcValue) : srcValue;
                } else {
                    return srcValue;
                }
            }
        );

        this.setState({
            policy,
            errors: key.indexOf('condition') === -1 ? _.omit(this.state.errors, key) : _.omit(this.state.errors, errorKey ? 'condition.condition.' + errorKey : ''),
        }, () => {
            this.props.updatePolicy(policy);
        });
    };

    getThresholds = (thresholdKey, defaultValue) => {
        const { policy } = this.state;
        const value = _.get(policy, thresholdKey, defaultValue);

        return _.get(policy, 'object_type', '') === 'STB' ? value : this.getSeconds(value);
    };

    onSubmit = () => {
        if (typeof this.props.onSubmit === 'function') {
            // this.props.onSubmit(this.props.userId, this.state.user);
            this.props.onSubmit(this.props.policyId, this.state.policy);
        }
    };

    onTest = () => {
        if (typeof this.props.onTest === 'function') {
            const policy = this.props.policyId ? {
                id: this.props.policyId,
                ...this.state.policy,
            } : this.state.policy;

            this.props.onTest(policy);
        }
    };

    mapPolicies = memoize((policies, policyId) =>
        policies
            .filter(policy => policy.id !== policyId)
            .map(policy => ({ value: policy.id, title: policy.name })));

    getSeconds = (mills) => {
        return moment.duration(mills, 'milliseconds').asSeconds() || '';
    };

    getMilliSeconds = (secs) => {
        return moment.duration(Number(secs), 'seconds').asMilliseconds() || '';
    };

    render() {
        const { active, policyId, scopes, policyTypes, policies, objectTypes, kqiList, mrfList } = this.props;
        const { policy, errors, metaData } = this.state;
        const threshold = _.get(metaData, 'threshold', false);
        const duration = _.get(metaData, 'duration', false);
        const modalTitle = policyId
            ? ls('POLICIES_EDIT_POLICY_TITLE', 'Редактировать политику') + ' ' +  _.get(this.props.policy, 'name', '')
            : ls('POLICIES_CREATE_POLICY_TITLE', 'Создать политику');
        return (
            <Fragment>
                <DraggableWrapper>
                    <Modal
                        isOpen={active}
                        className={styles.policyEditor}
                    >
                        <ModalHeader toggle={this.props.onClose} className="handle">{modalTitle}</ModalHeader>
                        <ModalBody>
                            <Preloader active={this.props.loading}>
                                <div className={styles.policyEditorContent}>
                                    <div className={styles.policyEditorColumn}>
                                        <Configuration
                                            setPolicyProperty={(key, value) => this.setPolicyProperty(key, value)}
                                            getThresholds={this.getThresholds}
                                            policyTypes={policyTypes}
                                            objectTypes={objectTypes}
                                            metaData={metaData}
                                            policy={policy}
                                            errors={errors}
                                        />
                                        <Scope
                                            scopeList={scopes}
                                            kqiList={kqiList}
                                            mrfList={mrfList}
                                            scopes={this.getPolicyProperty('scopes')}
                                            onChange={scopes => this.setPolicyProperty('scopes', scopes)}
                                        />
                                        {(threshold || duration) && (
                                            <Panel
                                                title={ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <div style={{ width: '55%' }}>
                                                        <Field
                                                            id="cease_duration"
                                                            labelText={ls('POLICIES_ADD', 'Интервал агрегации')}
                                                            labelWidth="60%"
                                                            inputWidth="85px"
                                                            required
                                                        >
                                                            <div style={{ display: 'flex' }}>
                                                                <Input
                                                                    itemId="policies_cease_duration"
                                                                    id="cease_duration"
                                                                    type="number"
                                                                    name="cease_duration"
                                                                    placeholder="0"
                                                                    valid={_.isEmpty(_.get(errors, 'threshold.cease_duration'))}
                                                                    value={this.getSeconds(this.getPolicyProperty('threshold.cease_duration'))}
                                                                    onChange={value => this.setPolicyProperty('threshold.cease_duration', this.getMilliSeconds(value))}
                                                                    maxLength={6}
                                                                    errorMessage={_.get(errors, 'threshold.cease_duration.title')}
                                                                />
                                                                <span
                                                                    style={unitStyle}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                                                            </div>
                                                        </Field>
                                                    </div>
                                                    <div style={{ width: '45%' }}>
                                                        {threshold && <Field
                                                            id="cease_value"
                                                            labelText={`${ls('POLICIES_POLICY_FIELD_CEASE_VALUE', 'Порог')}`}
                                                            labelWidth="35%"
                                                            inputWidth="85px"
                                                            style={thresholdFieldStyle}
                                                            required
                                                        >
                                                            <div style={{ display: 'flex' }}>
                                                                <Input
                                                                    itemId="policies_cease_value"
                                                                    id="cease_value"
                                                                    type="number"
                                                                    name="cease_value"
                                                                    placeholder="0"
                                                                    valid={_.isEmpty(_.get(errors, 'threshold.cease_value'))}
                                                                    value={this.getThresholds('threshold.cease_value', '')}
                                                                    onChange={value => this.setPolicyProperty('threshold.cease_value', value)}
                                                                    maxLength={6}
                                                                />
                                                                <span
                                                                    style={unitStyle}>{ls('TRESHOLD_UNIT', 'ед.')}</span>
                                                            </div>
                                                        </Field>}
                                                    </div>
                                                </div>
                                            </Panel>
                                        )}
                                    </div>
                                    <div className={styles.policyEditorColumn}>
                                        <Condition
                                            metaData={metaData}
                                            condition={this.getPolicyProperty('condition')}
                                            parameters={_.get(this.state, 'metaData.parameters')}
                                            onChange={(condition, errorKey) => this.setPolicyProperty('condition', condition, errorKey)}
                                            errors={errors && _.get(errors, 'condition.condition')}
                                        />
                                    </div>
                                    {!_.isEmpty(this.state.metaData) &&
                                    (_.get(this.props, 'metaData.channel_suppression', false) ||
                                        _.get(this.props, 'metaData.hierarchy_suppression', false)) && (
                                        <Panel
                                            title={ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}
                                            className={styles.accidentsPanel}
                                        >
                                            {_.get(this.props, 'metaData.channel_suppression', false) && (
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
                                                        itemId="policies_exclude_tv_check"
                                                        id="exclude-tv"
                                                        checked={this.getPolicyProperty('channel_suppression')}
                                                        onChange={value => this.setPolicyProperty('channel_suppression', value)}
                                                    />
                                                </Field>
                                            )}
                                            {_.get(this.props, 'metaData.hierarchy_suppression', false) && (
                                                <Field
                                                    id="allow-accident"
                                                    labelText={`${ls('POLICIES_ALLOW_ACCIDENT_FIELD', 'Не поднимать аварию при наличии следующих типов аварий на вышестоящих элементах')}`}
                                                    labelWidth="97%"
                                                    inputWidth="3%"
                                                    labelAlign="right"
                                                    splitter=""
                                                    title={ls('POLICIES_ALLOW_ACCIDENT_FIELD', 'Не поднимать аварию при наличии следующих типов аварий на вышестоящих элементах')}
                                                >
                                                    <Checkbox
                                                        itemId="policies_allow_accident_check"
                                                        id="allow-accident"
                                                        checked={this.getPolicyProperty('allow_accident')}
                                                        onChange={value => this.setPolicyProperty('allow_accident', value)}
                                                    />
                                                </Field>
                                            )}
                                            {_.get(this.props, 'metaData.hierarchy_suppression', false) && (
                                                <Field
                                                    id="not-allowed-accident"
                                                    inputWidth="100%"
                                                    splitter=""
                                                    style={notAllowedAccidentStyle}
                                                >
                                                    <Select
                                                        itemId="policies_not_allowed_accident_field"
                                                        id="not-allowed-accident"
                                                        type="select"
                                                        placeholder={ls('POLICY_NOT_ALLOWED_ACCIDENT_PLACEHOLDER', 'Выбрать политику')}
                                                        options={this.mapPolicies(policies, policyId)}
                                                        value={this.getPolicyProperty('parent_policy') || ''}
                                                        onChange={value => this.setPolicyProperty('parent_policy', value)}
                                                        disabled={!this.getPolicyProperty('allow_accident')}
                                                        valid={_.isEmpty(_.get(errors, 'parent_policy'))}
                                                        errorMessage={_.get(errors, 'parent_policy.title')}
                                                    />
                                                </Field>
                                            )}
                                            {_.get(this.props, 'metaData.hierarchy_suppression', false) && (
                                                <Field
                                                    id="waiting-time"
                                                    labelText={ls('POLICIES_WAITING_TIME_OF_ACCIDENT', 'Время ожидания вышестоящей аварии')}
                                                    labelWidth="81%"
                                                    inputWidth="85px"
                                                    style={notAllowedAccidentStyle}
                                                >
                                                    <div style={{ display: 'flex' }}>
                                                        <Input
                                                            itemId="policies_waiting_time_field"
                                                            id="waiting-time"
                                                            type="number"
                                                            name="waiting-time"
                                                            placeholder="0"
                                                            value={this.getPolicyProperty('suppression_timeout')}
                                                            onChange={value => this.setPolicyProperty('suppression_timeout', value)}
                                                            disabled={!this.getPolicyProperty('allow_accident')}
                                                            maxLength={6}
                                                            valid={_.isEmpty(_.get(errors, 'suppression_timeout'))}
                                                            errorMessage={_.get(errors, 'suppression_timeout.title')}
                                                        />
                                                        <span
                                                            style={unitStyle}>{ls('MEASURE_UNITS_SECOND', 'сек.')}</span>
                                                    </div>
                                                </Field>
                                            )}
                                        </Panel>
                                    )}
                                </div>
                            </Preloader>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                itemId="policies_cancel"
                                outline
                                color="action"
                                onClick={this.props.onClose}>{ls('NEW_ROLE_CANCEL', 'Отмена')}</Button>
                            <Button itemId="policies_ok" color="action" onClick={this.onTest}>{policyId ? ls('SAVE', 'Сохранить') : ls('CREATE', 'Создать')}</Button>
                        </ModalFooter>
                    </Modal>
                </DraggableWrapper>
                {this.props.alertsCount !== -1 && (
                    <ConfirmDialog
                        itemId="policies_test"
                        active={this.props.alertsCount !== -1}
                        defaultY={200}
                        className={styles.testPolicyConfirm}
                        message={ls(
                            'POLICIES_TEST_CONFIRMATION_TEXT',
                            'При создании политики с указанными порогами будет показано {count} аварий. Вы уверены, что хотите создать эту политику?'
                        ).replace('{count}', this.props.alertsCount)}
                        okButtonTitle={ls('CONTINUE', 'Продолжить')}
                        cancelButtonAction={this.props.clearAlerts}
                        okButtonAction={this.onSubmit}
                    />
                )}
            </Fragment>
        );
    }
}

export default PolicyEditor;
