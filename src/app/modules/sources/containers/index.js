import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SourcesComponent from '../components';
import rest from '../../../rest';
import ls from "i18n";
import { fetchSourcesSuccess } from "../actions/index";
import * as _ from "lodash";

class Sources extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        sources: PropTypes.array,
        onFetchSourcesSuccess: PropTypes.func,
    };

    static defaultProps = {
        sources: [],
        onFetchSourcesSuccess: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('SOURCES_PAGE_TITLE', 'Источники'));
        this.fetchSources();
    }

    fetchSources = () => {
        this.setState({ isLoading: true });
        rest.get('/api/v1/sources/')
            .then((response) => {
                const sources = response.data;
                this.props.onFetchSourcesSuccess(sources);
                this.setState({ isLoading: false });
            });
    };

    render() {
        return (
            <SourcesComponent
                onRefresh={this.fetchSources}
                match={this.props.match}
                history={this.props.history}
                sources={this.props.sources}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    sources: _.get(state, 'sources.list'),
});

const mapDispatchToProps = dispatch => ({
    onFetchSourcesSuccess: sources => dispatch(fetchSourcesSuccess(sources)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Sources);
