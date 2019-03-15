import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Search from '../modules/Search/containers';
import List from './List';
import styles from './styles.scss';
import SubscriberCard from './SubscriberCard';
import TopologyProvider from '../containers/TopologyProvider';
import { selectSubscriber } from '../modules/Search/reducers';


class Subscribers extends React.PureComponent {
    static propTypes = {
        subscriberId: PropTypes.string,
        selectedSubscriber: PropTypes.object,
        page: PropTypes.string,
        id: PropTypes.string,
        searchBy: PropTypes.string,
        searchText: PropTypes.string,
        locationId: PropTypes.string,
        mac: PropTypes.string,
        buildLink: PropTypes.func.isRequired,
    };

    renderSearch = () => (<Search
        searchBy={this.props.searchBy}
        searchText={this.props.searchText}
        locationId={this.props.locationId}
        buildLink={this.props.buildLink}
    />);

    renderList = () => (<List
        searchBy={this.props.searchBy}
        searchText={this.props.searchText}
        locationId={this.props.locationId}
        buildLink={this.props.buildLink}
    />);

    renderTopology = (subscriber) => (
        <TopologyProvider subscriber={subscriber}>
            <SubscriberCard
                subscriber={subscriber}
                buildLink={this.props.buildLink}
                page={this.props.page}
                id={this.props.id}
                mac={this.props.mac}
            />
        </TopologyProvider>
    );

    render() {
        const subscriber = this.props.selectedSubscriber;
        return (
            <div className={styles.subscribersWrapper}>
                {this.renderSearch()}
                {subscriber === null ? (
                    this.renderList()
                ) : this.renderTopology(subscriber)}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    selectedSubscriber: selectSubscriber(state, { id: props.subscriberId }),
});

export default connect(mapStateToProps)(Subscribers);
