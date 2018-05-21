import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KQIComponent from '../components';
import { fetchResultHistorySuccess, fetchResultSuccess } from '../actions';
import rest from "../../../../../rest/index";
import * as _ from "lodash";

class KqiResults extends React.PureComponent {

    static propTypes = {
        active: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        resultId: PropTypes.string.isRequired,
        projectionId: PropTypes.string.isRequired,
        configId: PropTypes.string.isRequired,
        onFetchResultSuccess: PropTypes.func,
        onFetchResultHistorySuccess: PropTypes.func,
    };

    static defaultProps = {
        match: {},
        history: {},
        resultId: '',
        projectionId: '',
        configId: '',
        onFetchResultSuccess: () => null,
        onFetchResultHistorySuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        const { configId, projectionId, resultId } = this.props;
        this.fetchData(configId, projectionId, resultId);
    }

    fetchData = (configId, projectionId, resultId) => {
        Promise.all([this.fetchLocations(), this.fetchResult(configId, projectionId, resultId)])
            .then(([locationsResponse, resultResponse]) => {
                this.props.onFetchResultHistorySuccess([]);
                const result = resultResponse.data;
                const locations = locationsResponse.data;
                this.setState({ locations }, () => {
                    this.props.onFetchResultSuccess(result);
                })
            });
    };

    fetchResult = (configId, projectionId, resultId) => rest.get('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', {
        urlParams: {
            configId,
            projectionId,
            resultId
        }
    });

    fetchLocations = () => rest.get('/api/v1/common/location');

    fetchHistory = (nodes) => {
        const { configId, projectionId } = this.props;
        if (!_.isEmpty(nodes)) {
            rest.post('/api/v1/kqi/:configId/projection/:projectionId/result', nodes, {
                urlParams: {
                    configId,
                    projectionId
                }
            }).then((response) => {
                const data = response.data;
                this.props.onFetchResultHistorySuccess(data);
            })
        }
    };

    render() {
        return (
            <KQIComponent
                active={this.props.active}
                match={this.props.match}
                history={this.props.history}
                results={this.props.results}
                resHistory={this.props.resHistory}
                onMount={this.onFetchKQI}
                isLoading={this.state.isLoading}
                locations={this.state.locations}
                fetchHistory={this.fetchHistory}
                onClose={this.props.onClose}
            />
        );
    }
}

const mapStateToProps = state => ({
    results: _.get(state, 'kqi.results.list'),
    resHistory: _.get(state, 'kqi.results.history'),
});

const mapDispatchToProps = dispatch => ({
    onFetchResultSuccess: (result) => dispatch(fetchResultSuccess(result)),
    onFetchResultHistorySuccess: (history) => dispatch(fetchResultHistorySuccess(history)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KqiResults);