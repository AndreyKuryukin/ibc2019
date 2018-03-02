import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PolicyEditorComponent from '../components';
import rest from "../../../../../rest/index";

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        policyId: PropTypes.number,
    };

    static defaultProps = {
        policyId: null,
    };

    onChildMount = () => {
        console.log(this.props.policyId);
    };

    onSubmit = (policy) => {
        console.log(policy);
        rest.post('/api/v1/policy', policy)
            .then(() => {
                this.props.history.push('/policies');
            })
    };

    render() {
        return (
            <PolicyEditorComponent
                onSubmit={this.onSubmit}
                onMount={this.onChildMount}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PolicyEditor);