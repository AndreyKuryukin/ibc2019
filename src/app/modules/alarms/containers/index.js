import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import _ from 'lodash';
import { fetchMrfSuccess, fetchAlarmsSuccess, FILTER_ACTIONS } from '../actions';
import rest from '../../../rest';
import AlarmsComponent from '../components';

class Alarms extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        filter: PropTypes.object,
        alarms: PropTypes.array,
        locations: PropTypes.array,
        onFetchAlarmsSuccess: PropTypes.func,
        onFetchLocationsSuccess: PropTypes.func,
        onChangeFilter: PropTypes.func,
    };

    static defaultProps = {
        filter: null,
        alarms: [],
        locations: [],
        onFetchAlarmsSuccess: () => null,
        onFetchLocationsSuccess: () => null,
        onChangeFilter: () => null,
    };

    getChildContext() {
        return {
            history: this.props.history,
            match: this.props.match,
            location: this.props.location,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        rest.get('/api/v1/common/location')
            .then((response) => {
                const mrf = response.data;
                this.props.onFetchLocationsSuccess(mrf);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    onFetchAlarms = (filter) => {
        this.setState({ isLoading: true });
        const queryParams = {
            ...filter,
            type: this.props.match.params.type,
            start: filter.start.getTime(),
            end: filter.end.getTime(),
        };
        rest.get('/api/v1/alerts', {}, { queryParams })
            .then((response) => {
                const alarms = response.data;
                this.props.onFetchAlarmsSuccess(alarms);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            }) ;
    };

    render () {
        return (
            <AlarmsComponent
                history={this.props.history}
                match={this.props.match}
                filter={this.props.filter}
                alarms={this.props.alarms}
                locations={this.props.locations}
                onChangeFilter={this.props.onChangeFilter}
                onFetchAlarms={this.onFetchAlarms}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = (state, props) => ({
    filter: _.get(state, `alarms.${props.match.params.type}`, null),
    alarms: state.alarms.alarms,
    locations: state.alarms.mrf,
});

const mapDispatchToProps = (dispatch, props) => ({
    onFetchLocationsSuccess: mrf => dispatch(fetchMrfSuccess(mrf)),
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
    onChangeFilter: filter => _.isFunction(FILTER_ACTIONS[props.match.params.type]) ? dispatch(FILTER_ACTIONS[props.match.params.type](filter)) : null,

});

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
