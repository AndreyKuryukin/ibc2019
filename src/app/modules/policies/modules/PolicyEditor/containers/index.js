import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PolicyEditorComponent from '../components';
import { fetchPolicySuccess, resetPolicyEditor, updatePolicy, createPolicy } from '../actions';
import rest from '../../../../../rest';

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        policyId: PropTypes.number,
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

    onChildMount = () => {
        if (this.props.policyId) {
            const urlParams = {
                policyId: this.props.policyId,
            };

            rest.get('/api/v1/policy/:policyId', { urlParams })
                .then((response) => {
                    const policy = response.data;
                    this.props.onFetchPolicySuccess(policy);
                });
        }
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
        policyData.policy_type = "SIMPLE";
        policyData.scope_type = "NODE";
        policyData.condition = {condition: 'www'};
        submit('/api/v1/policy', policyData)
            .then(success);
    }

    render() {
        return (
            <PolicyEditorComponent
                onSubmit={this.onSubmit}
                onMount={this.onChildMount}
                onClose={this.props.onReset}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => ({
    policy: state.policies.editor.policy,
});

const mapDispatchToProps = dispatch => ({
    onFetchPolicySuccess: policy => dispatch(fetchPolicySuccess(policy)),
    onUpdatePolicySuccess: policy => dispatch(updatePolicy(policy)),
    onCreatePolicySuccess: policy => dispatch(createPolicy(policy)),
    onReset: () => dispatch(resetPolicyEditor()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PolicyEditor);