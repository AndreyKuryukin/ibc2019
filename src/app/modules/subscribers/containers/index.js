import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import SubscribersComponent from '../components';
import { SEARCH_PARAMS } from '../modules/Search/reducers';
import { composeQueryParams, getQueryParams } from "../../../util/state";
import ls from "i18n";

class Subscribers extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.shape({
            search: PropTypes.string.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('SUBSCRIBER_CARD','Карточка клиента'));
    }

    // todo: Move to helpers
    buildLink = ({
                     subscriberId = this.props.match.params.subscriberId || null,
                     page = null,
                     id = null,
                     query = getQueryParams(this.props.location),
                 }) => {
        const queryString = query === null
            ? ''
            : composeQueryParams(query);

        let link = '/subscribers';

        if (subscriberId === null) return `${link}?${queryString}`;
        link += `/${subscriberId}/`;

        if (page === null) return `${link}?${queryString}`;
        link += `${page}/`;

        if (id === null) return `${link}?${queryString}`;
        link += `${id}/`;

        return `${link}?${queryString}`;
    };

    render() {
        let { searchBy, searchText, location: locationId } = getQueryParams(this.props.location);
        const { page, id } = this.props.match.params;
        const subscriberId = this.props.match.params.subscriberId;
        if (subscriberId !== undefined && searchText === undefined && searchBy === undefined) {
            searchBy = SEARCH_PARAMS.SERVICE_ID;
            searchText = subscriberId;
        }

        return (
            <SubscribersComponent
                subscriberId={subscriberId}
                page={page}
                id={id}
                searchBy={searchBy}
                searchText={searchText}
                locationId={locationId}
                mac={searchBy === SEARCH_PARAMS.MAC ? searchText : null}
                buildLink={this.buildLink}
            />
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Subscribers)