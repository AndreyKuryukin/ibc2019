import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlarmsViewerComponent from '../components';
import rest from '../../../../../../../rest';
import { fetchAlarmSuccess } from '../actions';

class AlarmsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        alarmId: PropTypes.string,
        alarm: PropTypes.object,
        onFetchAlarmSuccess: PropTypes.func,
    };

    static defaultProps = {
        alarmId: '',
        alarm: null,
        onFetchAlarmSuccess: () => null,
    };

    onMount = () => {
        if (this.props.alarmId) {
            const urlParams = {
                id: this.props.alarmId,
            };
            rest.get('/api/v1/alarms/gp/:id', { urlParams })
                .then((response) => {
                    const alarm = response.data;
                    this.props.onFetchAlarmSuccess(alarm);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };

    render() {
        return (
            <AlarmsViewerComponent
                onMount={this.onMount}
                alarm={this.props.alarm}
                active={this.props.active}
            />
        );
    }
}

const mapStateToProps = state => ({
    alarm: state.alarms.groupPolicies.viewer,
});

const mapDispatchToProps = dispatch => ({
    onFetchAlarmSuccess: alarm => dispatch(fetchAlarmSuccess(alarm)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AlarmsViewer);