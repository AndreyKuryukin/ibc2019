import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.policy !== this.props.policy) {
            this.setState({ loading: true });
            Promise.all([
                this.makePolicyTypeRequest(nextProps.policy.objectType),
                this.makeMetaDataRequest(nextProps.policy.objectType, nextProps.policy.policy_type)])
                .then(([policyTypesResponse, metaDataResponse]) => {
                    const policyTypes = policyTypesResponse.data;
                    const metaData = metaDataResponse.data;
                    this.setState({ policyTypes, metaData, loading: false })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    state = {
        errors: null,
    };


    getValidationConfig = (policyData) => {
        return {
            name: {
                required: true
            },
            objectType: {
                required: true,
            },
            policy_type: {
                required: true,
            },
            threshold: () => ({
                cease_duration: {
                    required: true,
                },
                cease_value: {
                    required: true,
                },
                rise_duration: {
                    required: true,
                },
                rise_value: {
                    required: true,
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
        const { parameterType = '', operator = '', value = '' } = object;
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

    onChildMount = () => {
        const requests = [];
        requests.push(rest.get('/api/v1/policy/scopeTypes'));
        requests.push(rest.get('/api/v1/policy/objectTypes'));
        if (this.props.policyId) {
            const urlParams = {
                policyId: this.props.policyId,
            };
            requests.push(rest.get('/api/v1/policy/:policyId', { urlParams }))
        }
        this.setState({ loading: true });
        Promise.all(requests)
            .then(([scopeResp, objectTypesResp, policyResp]) => {
                const scopes = scopeResp.data;
                const objectTypes = objectTypesResp.data;
                this.setState({ objectTypes, loading: false }, () => {
                    this.props.onFetchScopesSuccess(scopes);
                    if (policyResp) {
                        this.props.onFetchPolicySuccess(policyResp.data);
                    }
                });
            })
            .catch((e) => {
                console.error(e);
            });
    };

    makePolicyTypeRequest = (objectType) => rest.get('/api/v1/policy/policyTypes/:objectType', { urlParams: { objectType } });

    fetchPolicyTypes = (objectType) => {
        if (objectType) {
            this.setState({ loading: true }, () => {
                this.makePolicyTypeRequest(objectType)
                    .then((response) => {
                        const policyTypes = response.data;
                        this.setState({ policyTypes, loading: false });
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            });
        } else {
            this.setState({ policyTypes: [] });
        }
    };

    makeMetaDataRequest = (objectType, policyType) => rest.get('/api/v1/policy/function/:objectType/:policyType', {
        urlParams: {
            objectType,
            policyType
        }
    });

    fetchMetaData = (objectType, policyType) => {
        if (policyType) {
            this.setState({ loading: true });
            this.makeMetaDataRequest(objectType, policyType)
                .then((response) => {
                    const metaData = response.data;
                    this.setState({ metaData, loading: false });
                })
                .catch((e) => {
                    console.error(e)
                })
        } else {
            this.setState({ metaData: {} });
        }

    };

    encodeConditions = (policyData) => {
        const condition = _.get(_.cloneDeep(policyData), 'condition');
        const conditionObject = _.get(condition, 'condition');
        const conjunctionList = _.get(conditionObject, 'conjunction.conjunctionList', []).map(conj => ({ value: this.composeConjunctionString(conj.value) }));
        _.set(conditionObject, 'conjunction.conjunctionList', conjunctionList);
        const conditionJson = JSON.stringify(conditionObject) || '';
        const conditionString = encodeURIComponent(conditionJson);
        return { ...condition, condition: conditionString };
    };

    decodeConditions = (policy) => {
        const conditionString = _.get(_.cloneDeep(policy), 'condition.condition', '');
        const conditionJson = decodeURIComponent(conditionString);
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
        const errors = validateForm(policyData, this.getValidationConfig(policyData));
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
        return (
            <PolicyEditorComponent
                onSubmit={this.onSubmit}
                onMount={this.onChildMount}
                onClose={this.props.onReset}
                policy={this.decodeConditions(this.props.policy)}
                errors={this.state.errors}
                objectTypes={this.state.objectTypes}
                policyTypes={this.state.policyTypes}
                metaData={this.state.metaData}
                loading={this.state.loading}
                fetchObjectTypes={this.fetchObjectTypes}
                fetchPolicyTypes={this.fetchPolicyTypes}
                fetchMetaData={this.fetchMetaData}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        policy: state.policies.editor.policy,
        scopes: state.policies.scopes,
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