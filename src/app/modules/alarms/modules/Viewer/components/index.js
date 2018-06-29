import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import moment from 'moment';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './styles.scss';
import DraggableWrapper from '../../../../../components/DraggableWrapper';
import Icon from '../../../../../components/Icon/Icon';
import { ALARMS_TYPES } from '../../../constants';
import { convertUTC0ToLocal } from '../../../../../util/date';

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
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
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
        this.context.history.push(`/alarms/${this.props.type}/${this.context.location.search}`);
    };

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALARMS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    getAlarmContent = (key) => {
        switch (key) {
            case 'raise_time':
                return _.get(this.props.alarm, key, null) ? convertUTC0ToLocal(_.get(this.props.alarm, key)).format('HH:mm:ss DD.MM.YYYY') : '';
            case 'duration':
                return this.getReadableDuration(_.get(this.props.alarm, key, 0));
            case 'notification_text':
                const text = _.get(this.props.alarm, key, '');
                const NEW_LINE_SYMBOL = '\n';
                return <ul className={styles.attributesList}>
                    {text.split(NEW_LINE_SYMBOL).map(line => <li>{line}</li>)}
                </ul>;
            case 'notified': {
                const notifications = _.get(this.props.alarm, key, []);
                return (
                    notifications.map(notif => (
                        <div className={styles.alarmContent}>
                            <Icon icon={`icon-state-${notif.status.toLowerCase()}`}
                                  title={ls(`ALARMS_STATUS_${notif.status.toUpperCase()}`, 'Статус')}
                            />
                            {notif.type}
                        </div>
                    ))
                );
            }
            case 'attributes':
                return <ul
                    className={styles.attributesList}>{_.reduce(_.get(this.props.alarm, key, {}), (result, value, key) => {
                    result.push(`${key}=${value}`);
                    return result;
                }, []).map(attr => <li title={attr}>{attr}</li>)}</ul>;
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
                        {`${ls('ALARMS_GROUP_POLICIES_ALARMS_VIEWER_TITLE', 'Детальная информация аварии №')}${this.getAlarmContent('id')}`}
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
                    <ModalFooter/>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default AlarmsViewer;