import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Widget from '../../Widget';
import styles from './subscriber-common.scss';
import SubscriberInfoWidget from './SubscriberInfoWidget';
import DevicesGrid from '../../../modules/Devices/components/DevicesGrid';
import {selectSubscriberTechnology, selectTopologyCommutator} from '../../../modules/Topology/reducers';
import SubscriberKAB from '../../../modules/KabByService/containers';
import Alerts from '../alerts';
import {selectMRFMap, selectRFMap, MRFPropType, RFPropType} from '../../../../../reducers/common/location';
import { isMacKQILoading, selectKQIMap } from "../../../reducers/kqi/mac";
import { selectIsTopologyLoading } from "../../../modules/Topology/reducers/index";
import ls from "i18n";

class SubscriberCommon extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object,
        technology: PropTypes.string,
        commutator: PropTypes.string,
        subscriberDevices: PropTypes.array,
        topologyDevices: PropTypes.array,
        mrfById: PropTypes.objectOf(MRFPropType),
        rfById: PropTypes.objectOf(RFPropType),
        mac: PropTypes.string,
        buildLink: PropTypes.func.isRequired,
    };

    render() {
        const {subscriber, technology, commutator, mrfById, rfById} = this.props;

        return (
            <div className={styles.subscriberCommon}>
                <SubscriberInfoWidget
                    subscriber={subscriber}
                    technology={technology}
                    commutator={commutator}
                    mrfById={mrfById}
                    rfById={rfById}
                />
                <Widget
                    title="Equipment condition"
                    detailsLink={this.props.buildLink({page: 'devices'})}
                >
                    <DevicesGrid
                        subscriberDevices={this.props.subscriberDevices}
                        topologyDevices={this.props.topologyDevices}
                    />
                </Widget>
                <Widget
                    title={<span>KQI<sub>sub</sub> consolidated</span>}
                    detailsLink={this.props.buildLink({page: 'kab_by_service'})}
                >
                    <SubscriberKAB
                        subscriber={this.props.subscriber}
                        devices={this.props.subscriberDevices}
                    />
                </Widget>
                <Alerts
                    subscriber={this.props.subscriber}
                    detailsLink={this.props.buildLink({page: 'alerts'})}
                    mac={this.props.mac}
                    buildLink={this.props.buildLink}
                    subscriberDevices={this.props.subscriberDevices}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    technology: selectSubscriberTechnology(state),
    commutator: selectTopologyCommutator(state),
    mrfById: selectMRFMap(state),
    rfById: selectRFMap(state),
    kqi: selectKQIMap(state),
    isKQILoading: isMacKQILoading(state),
    isTopologyLoading: selectIsTopologyLoading(state),
});

export default connect(mapStateToProps)(SubscriberCommon);
