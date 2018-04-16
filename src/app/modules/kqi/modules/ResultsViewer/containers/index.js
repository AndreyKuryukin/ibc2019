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
        this.fetchResult(configId, projectionId, resultId);
    }

    fetchResult = (configId, projectionId, resultId) => {
        rest.get('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', {
            urlParams: {
                configId,
                projectionId,
                resultId
            }
        }).then((response) => {
            const result = response.data;
            this.props.onFetchResultSuccess(result)
        })
    };

    fetchHistory = (nodes) => {
        const { configId, projectionId, resultId } = this.props;
        if (_.isEmpty(nodes)) {
            this.props.onFetchResultHistorySuccess([])
        } else {
            rest.post('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', nodes, {
                urlParams: {
                    configId,
                    projectionId,
                    resultId
                }
            }).then((response) => {
                const history = response.data;
                this.props.onFetchResultHistorySuccess(history)
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