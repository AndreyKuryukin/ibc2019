import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ls from 'i18n';
import PolicyEditorComponent from '../components';
import { createPolicy, fetchPolicySuccess, resetPolicyEditor, updatePolicy } from '../actions';
import { fetchScopesSuccess, fetchTypesSuccess } from '../../../actions'
import rest from '../../../../../rest';
import * as _ from "lodash";
import { validateForm } from '../../../../../util/validation';

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        policyId: PropTypes.number,
        scopes: PropTypes.array,
        types: PropTypes.array,
        onFetchPolicySuccess: PropTypes.func,
        onUpdatePolicySuccess: PropTypes.func,
        onCreatePolicySuccess: PropTypes.func,
        onReset: PropTypes.func,
    };

    static defaultProps = {
        policyId: null,
        onFetchPolicySuccess: () => null,
        onUpdatePolicySuccess: () => null,
        onCreatePolicySuccess: () => null,
        onReset: () => null,
    };

    componentDidMount() {
        this.context.pageBlur && this.context.pageBlur(true);
        this.fetchBasicData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.policy !== this.props.policy) {
            this.setState({ loading: true });
            Promise.all([
                this.fetchPolicyTypes(nextProps.policy.object_type),
                this.fetchMetaData(nextProps.policy.object_type, nextProps.policy.policy_type),
                this.fetchScopeTypes(nextProps.policy.object_type, nextProps.policy.policy_type)])
                .then(([policyTypes, metaData, scopeTypes]) => {
                    this.setState({
                        policy: this.decodeConditions(nextProps.policy),
                        policyTypes,
                        metaData,
                        scopeTypes,
                        loading: false
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    state = {
        errors: null,
    };


    getValidationConfig = (metaData) => {
        return {
            name: {
                required: true
            },
            object_type: {
                required: true,
            },
            policy_type: {
                required: true,
            },
            threshold: () => ({
                cease_duration: {
                    required: true,
                    ceaseLessThanRise: true,
                },
                cease_value: {
                    required: _.get(metaData, 'group') !== 'SIMPLE',
                },
                rise_duration: {
                    required: true,
                    ceaseLessThanRise: true,
                },
                rise_value: {
                    required: _.get(metaData, 'group') !== 'SIMPLE',
                }
            }),
            condition: () => ({
                condition: () => ({
                    conditionDuration: {
                        required: true,
                        min: 0,
                    },
                    conjunction: () => ({
                        type: {
                            required: true,
                        },
                        conjunctionList: [{
                            notEmpty: true,
                        },
                            {
                                value: () => ({
                                    parameterType: {
                                        required: true,
                                    },
                                    operator: {
                                        required: true,
                                    },
                                    value: {
                                        required: true,
                                    },
                                }),
                            }],
                    }),
                }),
            }),
        }
    };

    constructor() {
        super();
        this.state = {};
    }

    composeConjunctionString = (object) => {
        let { parameterType = '', operator = '', value = '' } = object;
        const conjString = `${parameterType} ${operator} ${value}`;
        return conjString.trim();
    };

    parseConjunctionString = (conjunctionString = '') => {
        const parts = conjunctionString.split(' ');
        const parameterType = _.get(parts, '0', '');
        const operator = _.get(parts, '1');
        const value = _.get(parts, '2');
        return {
            parameterType, operator, value
        };
    };

    mapKqi = (kqiList = []) => kqiList.map(kqi => ({ id: String(kqi.id), name: kqi.name }));

    fetchBasicData = () => {
        const requests = [];
        requests.push(rest.get('/api/v1/kqi/projection/'));
        requests.push(rest.get('/api/v1/policy/objectTypes'));
        if (this.props.policyId) {
            const urlParams = {
                policyId: this.props.policyId,
            };
            requests.push(rest.get('/api/v1/policy/:policyId', { urlParams }))
        }
        this.setState({ loading: true });
        Promise.all(requests)
            .then(([kqiResp, objectTypesResp, policyResp]) => {
                const objectTypes = objectTypesResp.data;
                const kqiList = kqiResp.data;
                const policy = _.get(policyResp, 'data');
                this.setState({ objectTypes, kqiList: this.mapKqi(kqiList), loading: false, policy }, () => {
                    if (policyResp) {
                        this.props.onFetchPolicySuccess(policy);
                    }
                });
            })
            .catch((e) => {
                this.setState({ loading: false });
                console.error(e);
                this.setState({ loading: false });
            });
    };

    makePolicyTypeRequest = (objectType) => {
        this.setState({ loading: true });
        this.fetchPolicyTypes(objectType)
            .then((policyTypes) => {
                this.setState({ loading: false, policyTypes })
            });
    };

    fetchPolicyTypes = (objectType) => {
        if (objectType) {
            return rest.get('/api/v1/policy/policyTypes/:objectType', { urlParams: { objectType } })
                .then((response) => {
                    return response.data;
                })
                .catch((e) => {
                    console.error(e);
                    return {};
                })
        } else {
            return Promise.resolve([])
        }
    };

    fetchScopeTypes = (objectType, policytype) => {
        if (objectType && policytype) {
            return rest.get('/api/v1/policy/scopeTypes', {
                urlParams: {
                    objectType
                }
            }, {
                queryParams: {
                    objectType,
                    'function': policytype
                }
            })
                .then((response) => {
                    return response.data;
                })
                .catch((e) => {
                    console.error(e);
                    return {};
                })
        } else {
            return Promise.resolve([])
        }
    };

    updatePolicy = (policy) => {
        this.setState({ policy });
    };

    applyMetaDataToPolicy = (metaData, policy) => {
        if (_.get(metaData, 'group') === 'SIMPLE') {
            let threshold = _.get(policy, 'threshold', {});
            threshold = { ...threshold, cease_value: 0, rise_value: 0 };
            policy.threshold = threshold;
        }
        return policy;
    };

    makeMetaDataRequest = (objectType, policyType) => {
        this.setState({ loading: true });
        Promise.all([this.fetchMetaData(objectType, policyType), this.fetchScopeTypes(objectType, policyType)])
            .then(([metaData, scopeTypes]) => {
                const policy = this.applyMetaDataToPolicy(metaData, this.state.policy);
                this.setState({ policy, metaData, scopeTypes, loading: false });
            });
    };

    fetchMetaData = (objectType, policyType) => {
        if (policyType && objectType) {
            return rest.get('/api/v1/policy/function/:objectType/:policyType', {
                urlParams: {
                    objectType,
                    policyType
                }
            })
                .then((response) => {
                    return response.data;
                })
                .catch((e) => {
                    console.error(e);
                    return {}
                })
        } else {
            return Promise.resolve({});
        }

    };

    encodeConditions = (policyData) => {
        const condition = _.get(_.cloneDeep(policyData), 'condition');
        const conditionObject = _.get(condition, 'condition');
        const conjunctionList = _.get(conditionObject, 'conjunction.conjunctionList', []).map(conj => ({ value: this.composeConjunctionString(conj.value) }));
        _.set(conditionObject, 'conjunction.conjunctionList', conjunctionList);
        const conditionJson = JSON.stringify(conditionObject) || '';
        const conditionString = conditionJson //encodeURIComponent(conditionJson);
        return { ...condition, condition: conditionString };
    };

    decodeConditions = (policy) => {
        const conditionString = _.get(_.cloneDeep(policy), 'condition.condition', '');
        const conditionJson = conditionString; //decodeURIComponent(conditionString);
        if (conditionJson) {
            try {
                const condition = JSON.parse(conditionJson);
                const conjunctionList = _.get(condition, 'conjunction.conjunctionList', []).map(conj => ({ value: this.parseConjunctionString(conj.value) }));
                _.set(condition, 'conjunction.conjunctionList', conjunctionList);
                _.set(policy, 'condition.condition', condition);
            } catch (e) {
                console.log(e)
            }
        }
        return policy;
    };

    onSubmit = (policyId, policyData) => {
        const messages = {
            ceaseLessThanRise: ls('CEASE_LESS_THAN_RISE_ERROR_MESSAGE', 'Интервал агрегации окончания аварии должен быть больше, чем интервал агрегации начала аварии'),
        };
        const validators = {
            ceaseLessThanRise: () => !(_.get(policyData, 'threshold.cease_duration') && _.get(policyData, 'threshold.rise_duration'))
                || _.get(policyData, 'threshold.cease_duration') > _.get(policyData, 'threshold.rise_duration'),
        };
        const errors = validateForm(policyData, this.getValidationConfig(this.state.metaData, policyData), messages, validators);

        if (_.isEmpty(errors)) {
            const submit = policyId ? rest.put : rest.post;
            const success = (response) => {
                const callback = policyId ? this.props.onUpdatePolicySuccess : this.props.onCreatePolicySuccess;
                const policy = response.data;
                callback(policy);
                this.context.history.push('/policies');
                this.props.onReset();
            };
            const policy = _.set({ ...policyData }, 'condition', this.encodeConditions(policyData));
            policyId && (policy.id = policyId);
            submit('/api/v1/policy', policy)
                .then(success);
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const props = _.omit(this.props, ['policy']);
        return (
            <PolicyEditorComponent
                onSubmit={this.onSubmit}
                onClose={this.props.onReset}
                policy={this.state.policy}
                errors={this.state.errors}
                objectTypes={this.state.objectTypes}
                policyTypes={this.state.policyTypes}
                metaData={this.state.metaData}
                loading={this.state.loading}
                fetchObjectTypes={this.fetchObjectTypes}
                fetchPolicyTypes={this.makePolicyTypeRequest}
                fetchMetaData={this.makeMetaDataRequest}
                updatePolicy={this.updatePolicy}
                scopes={this.state.scopeTypes}
                kqiList={this.state.kqiList}
                {...props}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        policy: state.policies.editor.policy,
        types: state.policies.types,
    }
};

const mapDispatchToProps = dispatch => ({
    onFetchTypesSuccess: types => dispatch(fetchTypesSuccess(types)),
    onFetchScopesSuccess: scopes => dispatch(fetchScopesSuccess(scopes)),
    onFetchPolicySuccess: policy => dispatch(fetchPolicySuccess(policy)),
    onUpdatePolicySuccess: policy => dispatch(updatePolicy(policy)),
    onCreatePolicySuccess: policy => dispatch(createPolicy(policy)),
    onReset: () => dispatch(resetPolicyEditor()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PolicyEditor);