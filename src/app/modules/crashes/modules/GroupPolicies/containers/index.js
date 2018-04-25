import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rest from '../../../../../rest';
import GroupPoliciesComponent from '../components/index';
import { fetchAlarmsSuccess } from '../actions';

class GroupPolicies extends React.PureComponent {
    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
        alarmsList: PropTypes.array,
        onFetchAlarmsSuccess: PropTypes.func,
    };

    static defaultProps = {
        params: null,
        alarmsList: [],
        onFetchAlarmsSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    onMount = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/alarms/gp')
            .then((response) => {
                const alarms = response.data;
                this.props.onFetchAlarmsSuccess(alarms);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    render () {
        return (
            <GroupPoliciesComponent
                state={this.props.state}
                params={this.props.params}
                alarmsList={this.props.alarmsList}
                onMount={this.onMount}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    alarmsList: state.crashes.groupPolicies.alarms.list,
});

const mapDispatchToProps = dispatch => ({
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupPolicies);
