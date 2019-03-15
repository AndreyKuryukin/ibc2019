import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rest from '../../../../../rest';
import McastComponent from '../components';
import { RANGES, selectRange } from '../../../reducers/kqi/range';
import { selectSubscriberMacs } from '../../Topology/reducers';

class Mcast extends React.Component {
	static propTypes = {
        macs: PropTypes.arrayOf(PropTypes.string).isRequired,
		range: PropTypes.oneOf(Object.values(RANGES)).isRequired,
        subscriber: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			mac: props.macs.length !== 0 ? props.macs[0] : '',
			data: [],
		};
	}

    shouldComponentUpdate(nextProps, nextState) {
        const { macs, range, subscriber } = this.props;
        const { isLoading, mac, data } = this.state;

        return (range !== nextProps.range)
            || (subscriber !== nextProps.subscriber)
            || (!_.isEqual(macs, nextProps.macs))
			|| (isLoading !== nextState.isLoading)
            || (mac !== nextState.mac)
            || (data !== nextState.data);
    }

	componentDidMount() {
		const { subscriber, range } = this.props;
		const { mac } = this.state;

		this.fetchMcastData(mac, subscriber.affilate_id, range);
	}

    componentDidUpdate(prevProps, prevState) {
        const { subscriber, range, macs } = this.props;
        const { mac } = this.state;

        if (!_.isEqual(macs, prevProps.macs)) {
        	this.setState({ mac: macs.length !== 0 ? macs[0] : '' });
		}

		if (mac !== prevState.mac || subscriber !== prevProps.subscriber || range !== prevProps.range) {
            this.fetchMcastData(mac, subscriber.affilate_id, range);
		}
	}

	fetchMcastData = (mac, affilateId, periodUnit) => {
		if (!mac || !affilateId || !periodUnit) return;

		if (!this.state.isLoading) {
			this.setState({ isLoading: true });
		}

		rest.get('kqi/v1/online/kabs/mcast', {}, { queryParams: { mac, affilateId, periodUnit } })
			.then((response) => {
                this.setState({
					data: response.data.sort((a, b) => (new Date(a.start_date).getTime() - new Date(b.start_date).getTime())),
					isLoading: false
                });
			})
			.catch((e) => {
				console.error(e);
				this.setState({ isLoading: false });
			})
	};

    onSelectMac = (mac) => {
    	this.setState({ mac });
	}

	render() {
		return (
			<McastComponent
				macs={this.props.macs}
				data={this.state.data}
				mac={this.state.mac}
				isLoading={this.state.isLoading}
				onSelectMac={this.onSelectMac}
			/>
		);
	}
}

const mapStateToProps = state => ({
    macs: selectSubscriberMacs(state),
	range: selectRange(state),
});

export default connect(mapStateToProps, null)(Mcast);
