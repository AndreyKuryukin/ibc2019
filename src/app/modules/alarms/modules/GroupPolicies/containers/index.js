import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rest from '../../../../../rest';
import GroupPoliciesComponent from '../components/index';
import { fetchAlarmsSuccess, fetchRegionsSuccess, fetchLocationsSuccess } from '../actions';
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
        onFetchAlarmsSuccess: PropTypes.func,
        onFetchRegionsSuccess: PropTypes.func,
        onFetchLocationsSuccess: PropTypes.func,
    };

    static defaultProps = {
        params: null,
        alarmsList: [],
        rfOptions: [],
        mrfOptions: [],
        onFetchAlarmsSuccess: () => null,
        onFetchRegionsSuccess: () => null,
        onFetchLocationsSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            appliedFilter: {
                mrf: '',
                rf: '',
            },
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('ALARMS_GROUP_POLICIES_PAGE_TITLE', 'Сообщения по групповым политикам'));
    }

    onFetchAlarms = (filter, isLoaderHidden) => {
        if (!isLoaderHidden) this.setState({ isLoading: true });
        //todo: Переделать на реальные фильтры
        const start_ent_stab = {
            start: moment().subtract(1, 'weeks').unix() * 1000,
            end: moment().unix() * 1000
        };
        const alarmsPromise = rest.get('/api/v1/alerts', {}, { queryParams: {...filter, ...start_ent_stab }})
            .then((response) => {
                const alarms = response.data;
                this.props.onFetchAlarmsSuccess(alarms);
                this.setState({ appliedFilter: filter });
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
                filter={this.state.appliedFilter}
                onMount={this.onMount}
                isLoading={this.state.isLoading}
                onApplyFilter={this.onFetchAlarms}
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
});

const mapDispatchToProps = dispatch => ({
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
    onFetchRegionsSuccess: regions => dispatch(fetchRegionsSuccess(regions)),
    onFetchLocationsSuccess: locations => dispatch(fetchLocationsSuccess(locations)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupPolicies);