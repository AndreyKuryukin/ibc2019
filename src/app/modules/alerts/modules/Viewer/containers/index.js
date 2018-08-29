import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlertsViewerComponent from '../components';
import rest from '../../../../../rest';
import { fetchAlertSuccess } from '../actions';
import { ALERTS_TYPES } from '../../../constants';

class AlertsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        type: PropTypes.oneOf(ALERTS_TYPES).isRequired,
        alertId: PropTypes.string,
        alert: PropTypes.object,
        onFetchAlertSuccess: PropTypes.func,
    };

    static defaultProps = {
        alertId: '',
        alert: null,
        onFetchAlertSuccess: () => null,
    };

    onMount = () => {
        this.context.pageBlur(true);
        if (this.props.alertId) {
            const urlParams = {
                id: this.props.alertId,
            };
            rest.get('/api/v1/alerts/:id', { urlParams })
                .then((response) => {
                    const alert = response.data;
                    this.props.onFetchAlertSuccess(alert);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };

    render() {
        return (
            <AlertsViewerComponent
                type={this.props.type}
                onMount={this.onMount}
                alert={this.props.alert}
                active={this.props.active}
            />
        );
    }
}

const mapStateToProps = state => ({
    alert: state.alerts.viewer,
});

const mapDispatchToProps = dispatch => ({
    onFetchAlertSuccess: alert => dispatch(fetchAlertSuccess(alert)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AlertsViewer);