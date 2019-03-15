import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Widget from '../../Widget';
import ModeSwitcher, {MODE} from './ModeSwitcher';
import Alerts from './Alerts';
import styles from '../../subscribers-card.scss';
import AlertDetails from './AlertDetails';
import TypeFilter from './TypeFilter';
import ls from "i18n";

class SubscriberAlerts extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object,
        alertId: PropTypes.string,
        detailsLink: PropTypes.string,
        mac: PropTypes.string,
        history: PropTypes.object.isRequired,
        verbose: PropTypes.bool.isRequired,
        buildLink: PropTypes.func.isRequired,
    };
    static defaultProps = {
        verbose: false,
    };

    state = {
        type: null,
        mode: MODE.CHART,
        device: null,
    };

    onTypeChange = type => {
        if (type === this.state.type) {
            this.setState({type: null});
        } else {
            this.setState({type});
        }
    };
    onModeChange = mode => this.setState({mode});
    onDeviceSelect = device => this.setState({device});

    showAlertDetails = (data) => {
        this.props.history.push(
            this.props.buildLink({
                page: 'alerts',
                id: data.id,
            })
        );
    };
    closeAlertDetails = () => {
        this.props.history.push(
            this.props.buildLink({page: 'alerts'})
        );
    };

    renderControls() {
        if (this.props.verbose) {
            return [
                <ModeSwitcher
                    key="mode"
                    className={styles['blue-btn-group']}
                    value={this.state.mode}
                    style={{marginRight: 60}}
                    onChange={this.onModeChange}
                />,
                <TypeFilter
                    key="type"
                    className={styles['blue-btn-group']}
                    value={this.state.type}
                    onChange={this.onTypeChange}
                />,
            ];
        }
        return null;
    }

    render() {
        return (
            <Widget
                title={ls('ALERTS', "Аварии")}
                controls={this.renderControls()}
                detailsLink={this.props.detailsLink}
            >
                <Alerts
                    mode={this.state.mode}
                    type={this.state.type}
                    subscriber={this.props.subscriber}
                    deviceID={this.state.device}
                    desiredMAC={this.props.mac}
                    onAlertSelect={this.props.verbose ? this.showAlertDetails : undefined}
                    onDeviceSelect={this.onDeviceSelect}
                    buildLink={this.props.buildLink}
                />
                {this.props.verbose && (
                    <AlertDetails
                        id={this.props.alertId}
                        open={this.props.alertId !== undefined}
                        onClose={this.closeAlertDetails}
                    />
                )}
            </Widget>
        );
    }
}

export default withRouter(SubscriberAlerts);
