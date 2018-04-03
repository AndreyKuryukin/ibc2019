import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PolicyEditorComponent from '../components';
import { createPolicy, fetchPolicySuccess, resetPolicyEditor, updatePolicy } from '../actions';
import { fetchScopesSuccess, fetchTypesSuccess } from '../../../actions'
import rest from '../../../../../rest';
import * as _ from "lodash";

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

    onChildMount = () => {
        const requests = [];
        requests.push(rest.get('/api/v1/policy/policyTypes'));
        requests.push(rest.get('/api/v1/policy/scopeTypes'));
        if (this.props.policyId) {
            const urlParams = {
                policyId: this.props.policyId,
            };
            requests.push(rest.get('/api/v1/policy/:policyId', { urlParams }))
        }
        Promise.all(requests)
            .then(([typesResp, scopeResp, policyResp]) => {
                const types = typesResp.data;
                const scopes = scopeResp.data;

                this.props.onFetchTypesSuccess(types);
                this.props.onFetchScopesSuccess(scopes);
                if (policyResp) {
                    this.props.onFetchPolicySuccess(policyResp.data);
                }
            })
            .catch((e) => {
                console.error(e);
            });
    };

    encodeConditions = (policyData) => {
        const condition = _.get(policyData, 'condition');
        const conditionObject = _.get(condition, 'condition');
        const conditionJson = JSON.stringify(conditionObject) || '';
        const conditionString = encodeURIComponent(conditionJson);
        return { ...condition, condition: conditionString };
    };

    decodeConditions = (policy) => {
        const conditionString = _.get(policy, 'condition.condition', '');
        const conditionJson = decodeURIComponent(conditionString);
        if (conditionJson) {
            try {
                const condition = JSON.parse(conditionJson);
                _.set(policy, 'condition.condition', condition);
            } catch (e) {
                _.set(policy, 'condition.condition')
            }
        }
        return policy;
    };

    onSubmit = (policyId, policyData) => {
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
    };

    render() {
        return (
            <PolicyEditorComponent
                onSubmit={this.onSubmit}
                onMount={this.onChildMount}
                onClose={this.props.onReset}
                policy={this.decodeConditions(this.props.policy)}
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