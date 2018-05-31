import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import rest from '../../../../../rest';
import AlarmsContentComponent from '../components';
import ls from 'i18n';
import { FILTER_ACTIONS, fetchAlarmsSuccess } from '../actions';
import { ALARMS_TYPES } from '../constants';

class AlarmsContent extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
        params: PropTypes.object,
        filter: PropTypes.object,
        alarms: PropTypes.array,
        mrfOptions: PropTypes.array,
        onFetchAlarmsSuccess: PropTypes.func,
        onChangeFilterProperty: PropTypes.func,
    };

    static defaultProps = {
        params: null,
        filter: null,
        alarms: [],
        mrfOptions: [],
        onFetchAlarmsSuccess: () => null,
        onChangeFilterProperty: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'), ls(`ALARMS_${this.props.type.toUpperCase()}_PAGE_TITLE`, '')]);
    }

    onFetchAlarms = (filter) => {
        const queryParams = {
            ...filter,
            type: this.props.type,
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

    onMount = () => {};

    render() {
        return (
            <AlarmsContentComponent
                params={this.props.params}
                filter={this.props.filter}
                alarms={this.props.alarms}
                mrfOptions={this.props.mrfOptions}
                onMount={this.onMount}
                onChangeFilterProperty={this.props.onChangeFilterProperty}
                onFetchAlarms={this.onFetchAlarms}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = (state, props) => ({
    alarms: _.get(state, 'alarms.alarms.alarms', []),
    mrfOptions: _.get(state, 'alarms.mrf', []),
    filter: _.get(state, `alarms.${props.type}.filter`, null),
});

const mapDispatchToProps = (dispatch, props) => ({
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
    onChangeFilterProperty: (property, value) => _.isFunction(FILTER_ACTIONS[props.type]) ? dispatch(FILTER_ACTIONS[props.type](property, value)) : null,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AlarmsContent);