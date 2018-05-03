import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import moment from 'moment';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './styles.scss';
import DraggableWrapper from '../../../../../../../components/DraggableWrapper';
import Icon from '../../../../../../../components/Icon/Icon';

const infoScheme = [
    'raise_time',
    'policy_name',
    'duration',
    'notification_text',
    'notified',
    'attributes',
];

class AlarmsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        alarm: PropTypes.object,
        active: PropTypes.bool,
    };

    static defaultProps = {
        alarm: null,
        active: false,
    };

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onClose = () => {
        this.context.history.push(`/alarms/group-policies/current${this.context.location.search}`);
    };

    getReadableDuration = (seconds = 0) =>
        ['days', 'hours', 'minutes'].reduce((result, key) => {
            const duration = moment.duration(seconds, 'seconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALARMS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    getAlarmContent = (key) => {
        switch(key) {
            case 'duration':
                return this.getReadableDuration(_.get(this.props.alarm, key, 0));
            case 'notified': {
                const notifications = _.get(this.props.alarm, key, []);
                return (
                    notifications.map(notif => (
                        <div className={styles.alarmContent}>
                            <Icon icon={`icon-state-${notif.status.toLowerCase()}`}
                                  title={ls(`ALARMS_GROUP_POLICIES_NOTIFICATION_STATUS_${notif.status.toUpperCase()}`, '')}
                            />
                            {notif.type}
                        </div>
                    ))
                );
            }
            case 'attributes':
                return _.get(this.props.alarm, key, []).join(', ');
            default:
                return _.get(this.props.alarm, key, '');
        }
    };

    render() {
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.alarmsViewer}
                >
                    <ModalHeader
                        toggle={this.onClose}
                        className="handle"
                    >
                        {`${ls('ALARMS_GROUP_POLICIES_ALARMS_VIEWER_TITLE', 'Детальная информация по ГП аварии №')}${this.getAlarmContent('id')} (${this.getAlarmContent('priority')})`}
                    </ModalHeader>
                    <ModalBody>
                        <div className={styles.alarmsViewerContent}>
                            {infoScheme.map(key => (
                                <div key={key} className={styles.alarmsViewerRow}>
                                    <div>{ls(`ALARMS_GROUP_POLICIES_ALARMS_VIEWER_${key.toUpperCase()}`)}</div>
                                    <div>{this.getAlarmContent(key)}</div>
                                </div>
                            ))}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="action" onClick={this.onClose}>{ls('ALARMS_GROUP_POLICIES_ALARMS_VIEWER_CANCEL', 'Отмена')}</Button>
                        <Button color="action" onClick={this.onClose}>{ls('ALARMS_GROUP_POLICIES_ALARMS_VIEWER_OK', 'Ок')}</Button>
                    </ModalFooter>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default AlarmsViewer;