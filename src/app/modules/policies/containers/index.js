import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PoliciesComponent from '../components';

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
        console.log('fetchPolicies');
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
    policiesData: [{
        id: 1,
        name: 'Волга',
        condition: 'Условие',
        agregation: 'Функция агрегации',
        agregation_interval: {
            call: 'Вызов 1',
            ending: 'Окончание 1',
        },
        threshold: {
            call: 'Вызов 1',
            ending: 'Окончание 1',
        },
        scope: 'Область действия'
    }, {
        id: 2,
        name: 'Болга',
        condition: 'Условие',
        agregation: 'Агрегация',
        agregation_interval: {
            call: 'Вызов 2',
            ending: 'Окончание 2',
        },
        threshold: {
            call: 'Вызов 2',
            ending: 'Окончание 2',
        },
        scope: 'Область действия'
    }],
});

const mapDispatchToProps = dispatch => ({
    onFetchPoliciesSuccess: () => null,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Policies);
