import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlarmsViewerComponent from '../components';
import rest from '../../../../../rest';
import { fetchAlarmSuccess } from '../actions';
import { ALARMS_TYPES } from '../../../constants';

class AlarmsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
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
        this.context.pageBlur(true);
        if (this.props.alarmId) {
            const urlParams = {
                id: this.props.alarmId,
            };
            rest.get('/api/v1/alerts/:id', { urlParams })
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
                type={this.props.type}
                onMount={this.onMount}
                alarm={this.props.alarm}
                active={this.props.active}
            />
        );
    }
}

const mapStateToProps = state => ({
    alarm: state.alarms.viewer,
});

const mapDispatchToProps = dispatch => ({
    onFetchAlarmSuccess: alarm => dispatch(fetchAlarmSuccess(alarm)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AlarmsViewer);