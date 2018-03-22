import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PoliciesComponent from '../components';
import { fetchPoliciesSuccess } from '../actions';
import rest from '../../../rest';

class Policies extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        policiesData: PropTypes.array,
        onFetchPoliciesSuccess: PropTypes.func,
    };

    static defaultProps = {
        policiesData: [],
        onFetchPoliciesSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle('Политики');
    }

    fetchPolicies = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/policy')
            .then((response) => {
                const policies = response.data;
                this.props.onFetchPoliciesSuccess(policies);
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <PoliciesComponent
                match={this.props.match}
                history={this.props.history}
                policiesData={this.props.policiesData}
                onMount={this.fetchPolicies}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    policiesData: state.policies.policies.list,
});

const mapDispatchToProps = dispatch => ({
    onFetchPoliciesSuccess: policies => dispatch(fetchPoliciesSuccess(policies)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Policies);
