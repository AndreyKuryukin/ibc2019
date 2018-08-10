import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ls from 'i18n';
import PolicyEditorComponent from '../components';
import { fetchPolicySuccess, resetPolicyEditor } from '../actions';
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
        policyId: PropTypes.string,
        scopes: PropTypes.array,
        types: PropTypes.array,
        fetchPolicies: PropTypes.func,
        onFetchPolicySuccess: PropTypes.func,
        onUpdatePolicySuccess: PropTypes.func,
        onCreatePolicySuccess: PropTypes.func,
        onReset: PropTypes.func,
    };

    static defaultProps = {
        policyId: '',
        fetchPolicies: () => null,
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
                    const update = {
                        policyTypes,
                        metaData,
                        scopeTypes,
                        loading: false
                    };
                    if (!_.isEmpty(nextProps.policy)) {
                        update.policy = this.decodeConditions(nextProps.policy);
                    }
                    this.setState(update);
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

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
                    required: _.get(metaData, 'duration', false),
                    ceaseLessThanRise: true,
                },
                cease_value: {
                    required: _.get(metaData, 'threshold', false),
                },
                rise_duration: {
                    required: _.get(metaData, 'duration', false),
                    ceaseLessThanRise: true,
                },
                rise_value: {
                    required: _.get(metaData, 'threshold', false),
                }
            }),
            condition: () => ({
                condition: () => ({
                    conditionDuration: {
                        required: _.get(metaData, 'conditionDuration', false),
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

    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            policy: {
                condition: {
                    condition: {
                        conditionDuration: 0,
                        conjunction: {
                            type: 'AND',
                            conjunctionList: []
                        }
                    }
                },
                scopes: {},
            },
            threshold: {
                raise_value: 0,
                cease_value: 0,
                raise_duration: 0,
                cease_duration: 0,
            },
            mrfList: [],
            rfList: [],
            alarmsCount: -1,
        };
    }

    composeConjunctionString = (object) => {
        let { parameterType = '', operator = '', value = '' } = object;
        value = _.isString(value) ? `'${value}'` : value;
        const conjString = `${parameterType} ${operator} ${value}`;
        return conjString.trim();
    };

    parseConjunctionString = (conjunctionString = '') => {
        const parts = conjunctionString.split(' ');
        const parameterType = _.get(parts, '0', '');
        const operator = _.get(parts, '1');
        let value = _.get(parts, '2');
        value = value.indexOf("'") === -1 ? Number(value) : value.replace(/'+/g, '');
        return {
            parameterType, operator, value
        };
    };

    mapKqi = (kqiList = []) => kqiList.map(kqi => ({ id: String(kqi.id), name: kqi.name }));

    mapLocations = (locations = []) => locations.reduce((result, { id, name, rf }) => ({
        mrfList: [...result.mrfList, { id, name }],
        rfList: [...result.rfList, ...rf],
    }), { mrfList: [], rfList: [] });

    fetchBasicData = () => {
        const requests = [
            rest.get('/api/v1/kqi/projection/'),
            rest.get('/api/v1/policy/objectTypes'),
            rest.get('/api/v1/common/location'),
        ];

        if (this.props.policyId) {
            const urlParams = {
                policyId: this.props.policyId,
            };
            requests.push(rest.get('/api/v1/policy/:policyId', { urlParams }))
        }
        this.setState({ loading: true });
        Promise.all(requests)
            .then(([kqiResp, objectTypesResp, locationResp, policyResp]) => {
                const objectTypes = objectTypesResp.data;
                const kqiList = kqiResp.data;
                const policy = _.get(policyResp, 'data', false);
                const { mrfList, rfList } = this.mapLocations(locationResp.data);

                const update = {
                    objectTypes,
                    kqiList: this.mapKqi(kqiList),
                    mrfList,
                    rfList,
                    loading: false,
                };

                if (policy) {
                    update.policy = policy;
                }

                this.setState(update, () => {
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
                this.setState({ loading: false, policyTypes });
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
        if (!_.get(metaData, 'threshold')) {
            let threshold = _.get(policy, 'threshold', {});
            threshold = { ...threshold, cease_value: 0, rise_value: 0 };
            policy.threshold = threshold;
        }
        if (!_.get(metaData, 'duration')) {
            let threshold = _.get(policy, 'threshold', {});
            threshold = { ...threshold, cease_duration: 0, rise_duration: 0 };
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
                console.error(e);
            }
        }
        return policy;
    };

    validatePolicy = (policyData) => {
        const messages = {
            ceaseLessThanRise: ls('CEASE_LESS_THAN_RISE_ERROR_MESSAGE', 'Интервал агрегации окончания аварии должен быть больше, чем интервал агрегации начала аварии'),
        };
        const validators = {
            ceaseLessThanRise: () => !(_.get(policyData, 'threshold.cease_duration') && _.get(policyData, 'threshold.rise_duration'))
            || _.get(policyData, 'threshold.cease_duration') >= _.get(policyData, 'threshold.rise_duration'),
        };

        return validateForm(policyData, this.getValidationConfig(this.state.metaData, policyData), messages, validators);
    };

    onClose = () => {
        this.context.history.push('/policies');
        this.props.onReset();
    };

    onSubmit = (policyId, policyData) => {
        const errors = this.validatePolicy(policyData);

        this.setState({
            loading: true,
            alarmsCount: -1,
        });

        if (_.isEmpty(errors)) {
            const submit = policyId ? rest.put : rest.post;
            const success = (response) => {
                const policy = response.data;

                this.props.fetchPolicies();
                this.setState({ loading: false });
                this.context.history.push('/policies');
                this.props.onReset();
            };
            const policy = _.set({ ...policyData }, 'condition', this.encodeConditions(policyData));
            policyId && (policy.id = policyId);

            submit('/api/v1/policy', policy)
                .then(success)
                .catch(e => {
                    console.error(e);
                    this.setState({ loading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    onTest = (policyData) => {
        const errors = this.validatePolicy(policyData);

        if (_.isEmpty(errors)) {
            this.setState({ loading: true });
            const queryParams = {
                stepCount: 3,
                query: false,
            };
            const policy = _.set({ ...policyData }, 'condition', this.encodeConditions(policyData));
            rest.post('/policy/v1/check', policy, { queryParams })
                .then((response) => {
                    this.setState({
                        alarmsCount: response.data.resultCount,
                        loading: false,
                    });
                })
                .catch((e) => {
                    console.error(e);

                    this.setState({ loading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    clearAlarms = () => {
        this.setState({ alarmsCount: -1 });
    };

    render() {
        const props = _.omit(this.props, ['policy']);

        return (
            <PolicyEditorComponent
                onSubmit={this.onSubmit}
                onTest={this.onTest}
                onClose={this.onClose}
                alarmsCount={this.state.alarmsCount}
                clearAlarms={this.clearAlarms}
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
                mrfList={this.state.mrfList}
                rfList={this.state.rfList}
                {...props}
            />
        );
    }
}

const mapStateToProps = state => ({
    policy: state.policies.editor.policy,
    types: state.policies.types,
});

const mapDispatchToProps = dispatch => ({
    onFetchTypesSuccess: types => dispatch(fetchTypesSuccess(types)),
    onFetchScopesSuccess: scopes => dispatch(fetchScopesSuccess(scopes)),
    onFetchPolicySuccess: policy => dispatch(fetchPolicySuccess(policy)),
    onReset: () => dispatch(resetPolicyEditor()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PolicyEditor);