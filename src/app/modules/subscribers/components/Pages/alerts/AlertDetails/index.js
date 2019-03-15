import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import styles from '../../../subscribers-card.scss';
import {alert} from '../../../../rest';
import detailsStyles from './alert-details.scss';
import {selectAlert} from '../../../../reducers/pages/alerts';
import {convertUTC0ToLocal} from '../../../../../../util/date';
import ls from "i18n";

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
                alert: result,
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
                    Детальная информация аварии {this.props.id}
                </ModalHeader>
                <ModalBody>
                    <table className={detailsStyles['alert-details']}>
                        <tbody>
                            <tr>
                                <td>{ls('RAISE_TIME_LABEL','Время возникновения')}:</td>
                                <td>{this.getStartDate()}</td>
                            </tr>
                            <tr>
                                <td>{ls('POLICY_NAME_LABEL','Название политики')}:</td>
                                <td>{this.getPolicyName()}</td>
                            </tr>
                            <tr>
                                <td>{ls('DURATION_LABEL','Длительность')}:</td>
                                <td>{this.getDuration()}</td>
                            </tr>
                            <tr>
                                <td>{ls('MESSAGE_LABEL','Текст сообщения')}:</td>
                                <td>{this.getMessageText()}</td>
                            </tr>
                            <tr>
                                <td>{ls('NOTIFICATIONS_LABEL','Выполненные нотификации')}:</td>
                                <td>{this.getNotificationTypes()}</td>
                            </tr>
                            <tr>
                                <td>{ls('ALERTS_ATTRIBUTES', 'Атрибуты аварии')}:</td>
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
    alert: selectAlert(state, {id: props.id}),
});

export default connect(mapStateToProps)(AlertDetails);
