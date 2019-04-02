import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import styles from '../../../subscribers-card.scss';
import { alert } from '../../../../rest';
import detailsStyles from './alert-details.scss';
import { selectAlert } from '../../../../reducers/pages/alerts';
import { convertUTC0ToLocal } from '../../../../../../util/date';


const actualize = (alert) => {
    if (alert) {
        const duration = (moment(alert.cease_time || moment()).unix() - moment(alert.raise_time).unix()) * 1000;
        const raise_time_delta = (moment(alert.raise_time).unix() - moment(alert.raise_time).startOf('hour').unix()) * 1000;
        const raise_time = moment(moment().subtract(1, 'hour').unix() * 1000 + raise_time_delta).toISOString();
        const beta_cease_time = moment(raise_time).unix() * 1000 + duration;
        const cease_time = moment(moment(beta_cease_time).isAfter(moment()) ? moment().subtract(1, 'minute') : beta_cease_time).toISOString();

        const result = { ...alert };
        result.raise_time = raise_time;
        if (alert.cease_time) {
            result.cease_time = cease_time;
        }
        return result;
    }
    return alert
};


class AlertDetails extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        alert: PropTypes.shape({
            raise_time: PropTypes.string.isRequired,
            duration: PropTypes.number.isRequired,
        }),
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    state = {
        alert: null,
    };

    lastRequest = null;

    componentDidMount() {
        this.fetchDetails(this.props.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.fetchDetails(nextProps.id);
        }
    }

    fetchDetails = async (id) => {
        if (typeof id !== 'string') return;

        const request = alert(id);
        this.lastRequest = request;

        let result = null;
        try {
            result = await request;
        } catch (e) {
            console.error(e);
        }

        if (request === this.lastRequest) {
            this.setState({
                alert: actualize(result),
            });
        }
    };

    getStartDate() {
        if (this.props.alert === null) return '-';

        return convertUTC0ToLocal(this.props.alert.raise_time).format('HH:mm DD.MM.YYYY');
    }

    getPolicyName() {
        if (this.state.alert === null) return '-';
        return this.state.alert.policy_name;
    }

    getDuration() {
        if (this.props.alert === null || typeof this.props.alert.duration !== 'number') return '-';

        const duration = moment.duration(this.props.alert.duration);
        const days = duration.days().toString();
        const hours = duration.hours().toString().padStart(2, '0');
        const minutes = duration.minutes().toString().padStart(2, '0');
        const seconds = duration.seconds().toString().padStart(2, '0');

        return `${days}d ${hours}:${minutes}:${seconds}`;
    }

    getMessageText() {
        if (this.state.alert === null) return '-';
        return this.state.alert.notification_text;
    }

    getNotificationTypes() {
        if (this.state.alert === null) return '-';

        return (this.state.alert.notified || []).map(notified => (
            <span
                key={notified.type}
                title={notified.status}
                className={detailsStyles['notification-type']}
            >{notified.type}</span>
        ));
    }

    getAttributes() {
        if (this.state.alert === null) return '-';

        return Object.entries(this.state.alert.attributes || {})
            .map(pair => pair.join('='))
            .join(' ');
    }

    render() {
        return (
            <Modal
                isOpen={this.props.open}
                toggle={this.props.onClose}
                className={styles['white-modal']}
            >
                <ModalHeader toggle={this.props.onClose}>
                    Incident details {this.props.id}
                </ModalHeader>
                <ModalBody>
                    <table className={detailsStyles['alert-details']}>
                        <tbody>
                        <tr>
                            <td>{'Occurred'}:</td>
                            <td>{this.getStartDate()}</td>
                        </tr>
                        <tr>
                            <td>{'Policy'}:</td>
                            <td>{this.getPolicyName()}</td>
                        </tr>
                        <tr>
                            <td>{'Duration'}:</td>
                            <td>{this.getDuration()}</td>
                        </tr>
                        <tr>
                            <td>{'Message'}:</td>
                            <td>{this.getMessageText()}</td>
                        </tr>
                        <tr>
                            <td>{'Notifications sent'}:</td>
                            <td>{this.getNotificationTypes()}</td>
                        </tr>
                        <tr>
                            <td>{'Attributes'}:</td>
                            <td>
                                    <textarea
                                        readOnly
                                        value={this.getAttributes()}
                                        rows={15}
                                    />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToProps = (state, props) => ({
    alert: actualize(selectAlert(state, { id: props.id })),
});

export default connect(mapStateToProps)(AlertDetails);
