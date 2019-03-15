import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SearchComponent from '../components';
import { resetSearchResults, SEARCH_OPTIONS, searchStart, searchSuccess, } from '../reducers';

const localizeFilterOption = key => ({
    [SEARCH_OPTIONS.ALL]: 'Всем полям',
    [SEARCH_OPTIONS.SERVICE_ID]: 'Service ID',
    [SEARCH_OPTIONS.SAN]: 'SAN',
    [SEARCH_OPTIONS.MAC]: 'MAC',
    [SEARCH_OPTIONS.NLS]: 'Лицевой счёт',
}[key]);

class Search extends React.PureComponent {
    static propTypes = {
        searchBy: PropTypes.oneOf(Object.values(SEARCH_OPTIONS)),
        searchText: PropTypes.string,
        locationId: PropTypes.string,
        history: PropTypes.object.isRequired,
        onSearch: PropTypes.func.isRequired,
        resetSearchResults: PropTypes.func.isRequired,
    };

    static defaultProps = {
        searchBy: SEARCH_OPTIONS.ALL,
        searchText: '',
        locationId: null,
    };

    constructor(props) {
        super();
        this.state = {
            searchText: props.searchText,
            searchBy: props.searchBy,
            location: props.locationId,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchText === '') {
            this.props.resetSearchResults();
        }
        if (nextProps.searchText !== this.props.searchText) {
            this.setState({searchText: nextProps.searchText})
        }
        if (nextProps.searchBy !== this.props.searchBy) {
            this.setState({searchBy: nextProps.searchBy})
        }
        if (nextProps.locationId !== this.props.locationId) {
            this.setState({location: nextProps.locationId})
        }
    }

    componentWillUnmount() {
        this.props.resetSearchResults();
    }

    onSubmit = (query) => {

        const link = this.props.buildLink({
            subscriberId: null,
            query,
        });

        this.props.history.push(link);
    };

    render() {
        const { searchText, searchBy, location } = this.state;

        return (
            <SearchComponent
                searchBy={searchBy}
                location={location}
                searchText={searchText}
                buildLink={this.props.buildLink}
                onSubmit={this.onSubmit}
            />
        );
    }
}

const mapStateToProps = (state) => {

};

const mapDispatchToProps = dispatch => ({
    onSearch: () => dispatch(searchStart()),
    onSearchSuccess: subscribers => dispatch(searchSuccess(subscribers)),
    resetSearchResults: () => dispatch(resetSearchResults()),
});

export default connect(null, mapDispatchToProps)(withRouter(Search));
