import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './styles.scss';
import {
    isSubscribersLoading,
    SEARCH_OPTIONS,
    SEARCH_PARAMS,
    searchStart,
    searchSuccess,
    selectSubscribersSearchResult,
} from '../modules/Search/reducers';
import { search as searchRequest } from '../rest';
import { MRFPropType, RFPropType, selectMRFMap, selectRFMap } from '../../../reducers/common/location';
import Preloader from '../../../components/Preloader';
import ls from "i18n";

const MRF_ID_PROPERTY = 'sqm_mrf_id';
const RF_ID_PROPERTY = 'region_id';
const INFO_PROPERTIES = [MRF_ID_PROPERTY, RF_ID_PROPERTY, 'san', 'nls'];
const LOCALIZED_PROPERTIES = {
    sqm_mrf_id: 'МРФ',
    region_id: 'РФ',
    san: 'SAN',
    nls: ls('PERSONAL_ACCOUNT_NUMBER', 'Personal account number'),
};

class List extends React.PureComponent {
    static propTypes = {
        subscribers: PropTypes.array,
        searchBy: PropTypes.oneOf(Object.values(SEARCH_OPTIONS)),
        searchText: PropTypes.string,
        locationId: PropTypes.string,
        buildLink: PropTypes.func.isRequired,
        mrf: PropTypes.objectOf(MRFPropType).isRequired,
        rf: PropTypes.objectOf(RFPropType).isRequired,
        isLoading: PropTypes.bool.isRequired,
        onSearch: PropTypes.func.isRequired,
        onSearchSuccess: PropTypes.func.isRequired,
    };
    static defaultProps = {
        searchBy: SEARCH_OPTIONS.ALL,
        searchText: '',
    };

    lastRequest = null;

    componentDidMount() {
        this.fetchSubscribers();
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.searchBy !== nextProps.searchBy
            || this.props.searchText !== nextProps.searchText
            || this.props.locationId !== nextProps.locationId
        ) {
            this.fetchSubscribers(nextProps);
        }
    }

    fetchSubscribers = async (props = this.props) => {
        const { searchBy, searchText, locationId: location } = props;

        if (searchText === '') return;

        let params = {};
        if (searchText !== '') {
            const paramsList = searchBy === SEARCH_OPTIONS.ALL || searchBy === ''
                ? Object.values(SEARCH_PARAMS)
                : [searchBy];
            params = paramsList.reduce((result, param) => ({
                ...result,
                [param]: searchText,
            }), {});
        }

        this.props.onSearch();

        const request = searchRequest(params, location);
        this.lastRequest = request;
        let result = [];
        try {
            result = await this.lastRequest;
        } catch (e) {
            console.error('fetch search results error');
        }

        if (request === this.lastRequest) {
            this.lastRequest = null;
            this.props.onSearchSuccess(result);
        }
    };

    renderSubscriberInfo(subscriber) {
        return INFO_PROPERTIES
            .map(property => {
                let value = subscriber[property];

                if (property === MRF_ID_PROPERTY) {
                    const mrf = this.props.mrf[value];
                    if (mrf !== undefined) value = mrf.name;
                } else if (property === RF_ID_PROPERTY) {
                    const rf = this.props.rf[value];
                    if (rf !== undefined) value = rf.name;
                }

                return `${LOCALIZED_PROPERTIES[property]}: ${value || '-'}`;
            })
            .join(' | ');
    }

    renderItems(subscribers) {
        if (subscribers.length === 0) {
            return (
                <p className={styles.notFound}>Абонент не найден!</p>
            );
        }

        return subscribers.map(subscriber => (
            <Link
                key={subscriber.nls}
                className={styles.cardItem}
                to={this.props.buildLink({ subscriberId: encodeURIComponent(subscriber.service_id) })}
            >
                <div className={styles.cardTitle}>{`Service ID: ${subscriber.service_id}`}</div>
                <div>{this.renderSubscriberInfo(subscriber)}</div>
            </Link>
        ));
    }

    render() {
        const { subscribers, isLoading } = this.props;

        return (
            <Preloader active={isLoading}>
                <div className={styles.cardsList}>
                    {subscribers !== null && this.renderItems(subscribers)}
                </div>
            </Preloader>
        );
    }
}

const mapStateToProps = state => ({
    subscribers: selectSubscribersSearchResult(state),
    mrf: selectMRFMap(state),
    rf: selectRFMap(state),
    isLoading: isSubscribersLoading(state),
});
const mapDispatchToProps = dispatch => ({
    onSearch: () => dispatch(searchStart()),
    onSearchSuccess: subscribers => dispatch(searchSuccess(subscribers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
