import React from 'react';
import PropTypes from 'prop-types';
import Tabs from './Tabs';
import styles from './subscribers-card.scss';
import SubscriberCommon from './Pages/common';
import SubscriberAlerts from './Pages/alerts';
import SubscriberKAB from '../modules/KabByService/containers';
import SubscriberMetrics from '../modules/Metrics/containers';
import SubscriberDevices from '../modules/Devices/containers/index';
import SubscriberTopology from '../modules/Topology/containers/index';
import Neighbours from '../modules/Neighbours/containers';
import Mcast from '../modules/Mcast/containers';
import CardHead from './CardHead';
import Widget from "./Widget/index";
import ls from "i18n";

class SubscriberCard extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object.isRequired,
        page: PropTypes.string.isRequired,
        id: PropTypes.string,
        buildLink: PropTypes.func.isRequired,
        subscriberDevices: PropTypes.array,
        topologyDevices: PropTypes.array,
        mac: PropTypes.string,
    };
    static defaultProps = {
        page: 'common',
    };

    renderPage() {
        switch (this.props.page) {
            case 'common':
                return (
                    <SubscriberCommon
                        subscriber={this.props.subscriber}
                        subscriberDevices={this.props.subscriberDevices}
                        topologyDevices={this.props.topologyDevices}
                        mac={this.props.mac}
                        buildLink={this.props.buildLink}
                    />
                );
            case 'alerts':
                return (
                    <SubscriberAlerts
                        subscriber={this.props.subscriber}
                        alertId={this.props.id}
                        mac={this.props.mac}
                        buildLink={this.props.buildLink}
                        subscriberDevices={this.props.subscriberDevices}
                        verbose
                    />
                );
            case 'kab_by_service':
                return (
                    <Widget
                        title={<span>КQI<sub>sub</sub> by services</span>}
                    >
                        <SubscriberKAB
                            subscriber={this.props.subscriber}
                            devices={this.props.subscriberDevices}
                            verbose
                        />
                    </Widget>
                );
            case 'metrics':
                return (
                    <SubscriberMetrics
                        subscriber={this.props.subscriber}
                        subscriberDevices={this.props.subscriberDevices}
                    />
                );
            case 'devices':
                return (
                    <SubscriberDevices
                        subscriberDevices={this.props.subscriberDevices}
                        topologyDevices={this.props.topologyDevices}
                        subscriber={this.props.subscriber}
                    />
                );
            case 'neighbours':
                return (
                    <Neighbours
                        subscriber={this.props.subscriber}
                        topologyDevices={this.props.topologyDevices}
                    />
                );
            case 'mcast':
                return (
                    <Mcast
                        subscriber={this.props.subscriber}
                        subscriberDevices={this.props.subscriberDevices}/>
                );
            case 'topology':
                return (
                    <SubscriberTopology
                        subscriberDevices={this.props.subscriberDevices}
                        topologyDevices={this.props.topologyDevices}
                        subscriber={this.props.subscriber}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        const { page, buildLink } = this.props;

        return (
            <div className={styles.subscribersCard}>
                <CardHead subscriber={this.props.subscriber}/>
                <div className={styles.body}>
                    <Tabs activeTabId={page}>
                        <div
                            id="common"
                            link={buildLink({ page: 'common' })}
                            tabtitle={ls('COMMON_TAB', "Общая информация")}
                        />
                        <div
                            id="alerts"
                            link={buildLink({ page: 'alerts' })}
                            tabtitle={ls('ALERTS_TAB', "Аварии")}
                        />
                        <div
                            id="kab_by_service"
                            link={buildLink({ page: 'kab_by_service' })}
                            tabtitle={<span>KQI<sub>sub</sub> {ls('BY_SERVICES', 'по услугам')}</span>}
                        />
                        <div
                            id="metrics"
                            link={buildLink({ page: 'metrics' })}
                            tabtitle={ls('METRICS_TAB', "Метрики")}
                        />
                        <div
                            id="devices"
                            link={buildLink({ page: 'devices' })}
                            tabtitle={ls('EQUIPMENT_TAB', "Оборудование")}
                        />
                        <div
                            id="neighbours"
                            link={buildLink({ page: 'neighbours' })}
                            tabtitle={ls('NEIGHBOUR_PORTS_TAB', "Соседние порты")}
                        />
                        <div
                            id="mcast"
                            link={buildLink({ page: 'mcast' })}
                            tabtitle={ls('TV_HISTORY_TAB', "История телесмотрения")}
                        />
                        <div
                            id="topology"
                            link={buildLink({ page: 'topology' })}
                            tabtitle={ls('TOPOLOGY_TAB', "Топология")}
                        />
                    </Tabs>
                    <div className={styles.content}>{this.renderPage()}</div>
                </div>
            </div>
        );
    }
}

export default SubscriberCard;
