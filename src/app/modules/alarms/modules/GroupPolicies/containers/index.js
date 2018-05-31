import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rest from '../../../../../rest';
import GroupPoliciesComponent from '../components/index';
import { fetchAlarmsSuccess, fetchRegionsSuccess, fetchLocationsSuccess, setFilterProperty } from '../actions';
import ls from "i18n";
import moment from "moment";

class GroupPolicies extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
        alarmsList: PropTypes.array,
        rfOptions: PropTypes.array,
        mrfOptions: PropTypes.array,
        filter: PropTypes.object,
        onFetchAlarmsSuccess: PropTypes.func,
        onFetchRegionsSuccess: PropTypes.func,
        onFetchLocationsSuccess: PropTypes.func,
    };

    static defaultProps = {
        params: null,
        alarmsList: [],
        rfOptions: [],
        mrfOptions: [],
        filter: null,
        onFetchAlarmsSuccess: () => null,
        onFetchRegionsSuccess: () => null,
        onFetchLocationsSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'), ls('ALARMS_GROUP_POLICIES_PAGE_TITLE', 'Групповые политики')]);
    }

    onFetchAlarms = (filter, isLoaderHidden) => {
        if (!isLoaderHidden) this.setState({ isLoading: true });
        //todo: Переделать на реальные фильтры
        const queryParams = {
            ...filter,
            start: filter.start.getTime(),
            end: filter.end.getTime(),
        };
        const alarmsPromise = rest.get('/api/v1/alerts', {}, { queryParams })
            .then((response) => {
                const alarms = response.data;
                this.props.onFetchAlarmsSuccess(alarms);
                if (!isLoaderHidden) this.setState({ isLoading: false });
            });

        return isLoaderHidden ? alarmsPromise : alarmsPromise.catch((e) => {
            console.error(e);
            this.setState({ isLoading: false });
        });
    };

    onFetchFilterOptions = () =>
        Promise.all([rest.get('/api/v1/common/location'), rest.get('/api/v1/common/locations/rf')])
            .then(([mrfResponse, rfResponse]) => {
                const mrf = mrfResponse.data;
                const rf = rfResponse.data;
                this.props.onFetchLocationsSuccess(mrf);
                this.props.onFetchRegionsSuccess(rf);
            });

    onMount = (filter) => {
        this.setState({ isLoading: true });
        Promise.all([this.onFetchAlarms(filter, true), this.onFetchFilterOptions()])
            .then(() => {
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            })
    };

    render () {
        return (
            <GroupPoliciesComponent
                state={this.props.state}
                params={this.props.params}
                alarmsList={this.props.alarmsList}
                filter={this.props.filter}
                onMount={this.onMount}
                isLoading={this.state.isLoading}
                onChangeFilterProperty={this.props.onChangeFilterProperty}
                onFetchAlarms={this.onFetchAlarms}
                rfOptions={this.props.rfOptions}
                mrfOptions={this.props.mrfOptions}
            />
        );
    }
}

const mapStateToProps = state => ({
    alarmsList: state.alarms.groupPolicies.alarms.alarms,
    rfOptions: state.alarms.groupPolicies.alarms.regions,
    mrfOptions: state.alarms.groupPolicies.alarms.locations,
    filter: state.alarms.groupPolicies.alarms.filter,
});

const mapDispatchToProps = dispatch => ({
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
    onFetchRegionsSuccess: regions => dispatch(fetchRegionsSuccess(regions)),
    onFetchLocationsSuccess: locations => dispatch(fetchLocationsSuccess(locations)),
    onChangeFilterProperty: (property, value) => dispatch(setFilterProperty(property, value)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupPolicies);
