import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PolicyEditorComponent from '../components';

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
    }

    onSubmit = () => {
        console.log('onSubmit');
    }

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