import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import KqiCmp from "../components/index";
import rest from "../../../../../rest/index";
import _ from "lodash";
import { fetchHistorySuccess, setFilterProperty } from "../actions";
import ls from "i18n";

class KQI extends React.PureComponent {

    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };
    static propTypes = {
        history: PropTypes.object,
        match: PropTypes.object,
        filter: PropTypes.object,
        historyList: PropTypes.array,
        onChangeFilterProperty: PropTypes.func,
    };

    static defaultProps = {
        history: {},
        match: {},
        filter: null,
        historyList: [],
        onChangeFilterProperty: () => null,
    };

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'),ls('ALARMS_KQI_PAGE_TITLE', 'Сообщения по KQI')]);
        const state = _.get(this.props, 'match.params.state', 'history');
        const id = _.get(this.props, 'match.params.id');
        if (state === 'history') {
            this.fetchHistory(this.props.filter);
        }
        if (!_.isUndefined(id)) {
            this.context.pageBlur(true);
            this.fetchDetail(id);
        }
    }

    componentWillReceiveProps(nextProps) {
        const state = _.get(this.props, 'match.params.state', 'history');
        const id = _.get(this.props, 'match.params.id');
        const newState = _.get(nextProps, 'match.params.state', 'history');
        const newId = _.get(nextProps, 'match.params.id');

        if (!_.isEqual(newState, state) && newState === 'history') {
            this.fetchHistory();
        }
        if (!_.isEqual(id, newId) && !_.isUndefined(newId)) {
            this.context.pageBlur(true);
            this.fetchDetail(newId);
        }
    }

    fetchHistory = (filter) => {
        this.setState({ dataLoading: true });
        const queryParams = {
            ...filter,
            start: filter.start.getTime(),
            end: filter.end.getTime(),
        };
        rest.get('/api/v1/alarms/kqi/history', {}, { queryParams })
            .then((response) => {
                const history = response.data;
                if (history) {
                    this.props.onFetchHistorySuccess(history);
                    this.setState({ dataLoading: false });
                }
            })
            .catch(() => {
                this.setState({ dataLoading: false });
            });
    };

    fetchDetail = (id) => {
        this.setState({ detailLoading: true });
        rest.get('/api/v1/alarms/kqi/history/:id', { urlParams: { id } })
            .then((response) => {
                const detail = response.data;
                if (detail) {
                    this.setState({ detail, detailLoading: false });
                }
            })
            .catch(() => {
                this.setState({ detailLoading: false });
            });
    };

    render() {
        return (
            <KqiCmp
                history={this.props.history}
                match={this.props.match}
                filter={this.props.filter}
                data={this.props.historyList}
                dataLoading={_.get(this.state, 'dataLoading')}
                detail={_.get(this.state, 'detail')}
                detailLoading={_.get(this.state, 'detailLoading')}
                onChangeFilterProperty={this.props.onChangeFilterProperty}
                onFetchAlarms={this.fetchHistory}
            />
        );
    }
}

const mapStateToProps = state => ({
    historyList: _.get(state, 'alarms.kqi.history.history'),
    filter: _.get(state, 'alarms.kqi.history.filter'),
});

const mapDispatchToProps = dispatch => ({
    onFetchHistorySuccess: (history) => dispatch(fetchHistorySuccess(history)),
    onChangeFilterProperty: (property, value) => dispatch(setFilterProperty(property, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(KQI);
