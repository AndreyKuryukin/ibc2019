import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import KqiCmp from "../components/index";
import rest from "../../../../../rest/index";
import _ from "lodash";
import { fetchHistorySuccess } from "../actions/index";
import ls from "i18n";

class KQI extends React.PureComponent {

    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };
    static propTypes = {
        history: PropTypes.object,
        match: PropTypes.object,
        historyList: PropTypes.array,
    };

    static defaultProps = {
        history: {},
        match: {},
        historyList: [],
    };

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'),ls('ALARMS_KQI_PAGE_TITLE', 'Сообщения по KQI')]);
        const state = _.get(this.props, 'match.params.state', 'history');
        const id = _.get(this.props, 'match.params.id');
        if (state === 'history') {
            this.fetchHistory();
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

    fetchHistory = () => {
        this.setState({ dataLoading: true });
        rest.get('/api/v1/alarms/kqi/history')
            .then((response) => {
                const history = response.data;
                if (history) {
                    this.props.onFetchHistorySuccess(history);
                    this.setState({ dataLoading: false });
                }
            })
            .catch(() => {
                this.setState({ dataLoading: false });
            })
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
            })
    };

    render() {
        return <KqiCmp history={this.props.history}
                       match={this.props.match}
                       data={this.props.historyList}
                       dataLoading={_.get(this.state, 'dataLoading')}
                       detail={_.get(this.state, 'detail')}
                       detailLoading={_.get(this.state, 'detailLoading')}
        />
    }
}

const mapStateToProps = state => {
    return {
        historyList: _.get(state, 'alarms.kqi.history')
    };
};

const mapDispatchToProps = dispatch => ({
    onFetchHistorySuccess: (history) => dispatch(fetchHistorySuccess(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(KQI);
