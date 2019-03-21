import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import Widget from '../../../components/Widget';
import MetricsGrid from '../components/MetricsGrid';
import MacSelector from '../../../components/Pages/alerts/MacSelector';
import ls from "i18n";

class SubscriberMetrics extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object.isRequired,
        macs: PropTypes.arrayOf(PropTypes.string).isRequired,
        isLoading: PropTypes.bool.isRequired,
        hoursLimit: PropTypes.number,
        metrics: PropTypes.array,
        parameters: PropTypes.object,
        fetchStbData: PropTypes.func,
        onSelectMac: PropTypes.func,
        range: PropTypes.string,
    };

    state = {
        mac: null,
        isMacDropdownOpened: false,
    };

    getSelectedMac() {
        if (this.state.mac !== null) return this.state.mac;
        if (this.props.macs.length !== 0) {
            this.selectMac(this.props.macs[0]);
            return this.props.macs[0];
        }
        return null;
    }

    toggleMacDropdown = () => this.setState({
        isMacDropdownOpened: !this.state.isMacDropdownOpened,
    });

    selectMac = (mac) => {
        if (mac !== this.state.mac) {
            this.props.onSelectMac(mac);
            this.setState({ mac })
        }
    };

    renderControls() {
        const mac = this.getSelectedMac();

        return (
            <MacSelector
                macList={this.props.macs}
                selectedMac={mac}
                onMacSelect={this.selectMac}
            />
        );
    }

    render() {
        return (
            <Widget
                title={ls('DEVICE_METRICS_WIDGET_TITLE', "Метрики устройств")}
                controls={this.renderControls()}
            >
                <MetricsGrid
                    subscriber={this.props.subscriber}
                    isLoading={this.props.isLoading}
                    fetchStbData={this.props.fetchStbData}
                    metrics={this.props.metrics}
                    parameters={this.props.parameters}
                    range={this.props.range}
                    hoursLimit={this.props.hoursLimit}
                />
            </Widget>
        );
    }
}


export default SubscriberMetrics;
