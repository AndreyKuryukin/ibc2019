import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ls from 'i18n';
import ReportsComponent from '../components';
import { fetchReportsSuccess, removeResult } from '../actions';
import rest from '../../../rest';

class Reports extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        reportsData: PropTypes.array,
        onFetchReportsSuccess: PropTypes.func,
    };

    static defaultProps = {
        reportsData: [],
        onFetchReportsSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('PEPORTS_PAGE_TITLE', 'Отчёты'));
        this.fetchReports();
        this.fetchUsers();
    }

    fetchReports = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/report/result')
            .then((response) => {
                const reports = response.data;
                this.props.onFetchReportsSuccess(reports);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    fetchUsers = () => {
        rest.get('/api/v1/user')
            .then((response) => {
                const users = response.data;
                this.setState({ users })
            })
    };

    removeResult = (report_id) => {
        this.setState({ isLoading: true });

        rest.delete('/api/v1/report/result/:id', null, { urlParams: { id: report_id } })
            .then(() => {
                this.fetchReports();
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    retryResult = (report_id) => {
        rest.post('/api/v1/report/result/:id', null, { urlParams: { id: report_id } })
            .then(() => {
                this.fetchReports();
            });
    };

    render() {
        return (
            <ReportsComponent
                users={this.state.users}
                match={this.props.match}
                history={this.props.history}
                reportsData={this.props.reportsData}
                fetchReports={this.fetchReports}
                isLoading={this.state.isLoading}
                onRemoveResult={this.removeResult}
                onResultRetry={this.retryResult}
            />
        );
    }
}

const mapStateToProps = state => ({
    reportsData: state.reports.reports,
});

const mapDispatchToProps = dispatch => ({
    onFetchReportsSuccess: reports => dispatch(fetchReportsSuccess(reports)),
    onRemoveResult: id => dispatch(removeResult(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Reports);