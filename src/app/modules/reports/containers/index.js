import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReportsComponent from '../components';
import { fetchReportsSuccess } from '../actions';
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
        this.context.navBar.setPageTitle('Отчёты');
    }

    fetchReports = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/report')
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

    render() {
        return (
            <ReportsComponent
                match={this.props.match}
                history={this.props.history}
                reportsData={this.props.reportsData}
                onMount={this.fetchReports}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    reportsData: state.reports.reports,
});

const mapDispatchToProps = dispatch => ({
    onFetchReportsSuccess: reports => dispatch(fetchReportsSuccess(reports)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Reports);