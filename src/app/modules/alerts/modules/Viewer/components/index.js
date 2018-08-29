import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import moment from 'moment';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './styles.scss';
import DraggableWrapper from '../../../../../components/DraggableWrapper';
import Icon from '../../../../../components/Icon/Icon';
import { ALERTS_TYPES } from '../../../constants';
import { convertUTC0ToLocal } from '../../../../../util/date';

const infoScheme = [
    'raise_time',
    'policy_name',
    'duration',
    'notification_text',
    'notified',
    'attributes',
];

const DEFAULT_TEXTS = {
    RAISE_TIME: 'Время возникновения',
    POLICY_NAME: 'Название политики по каталогу',
    DURATION: 'Длительность',
    NOTIFICATION_TEXT: 'Текст сообщения',
    NOTIFIED: 'Выполненные нотификации по открытию',
    ATTRIBUTES: 'Все сохраняемые атрибуты аварии: (Значения макроподстановок)'
};


const DURATION_UNITS_MAP = {
    'DAYS': () => ls('ALERTS_GROUP_POLICIES_DURATION_DAYS_UNIT', 'дн. '),
    'HOURS': () => ls('ALERTS_GROUP_POLICIES_DURATION_HOURS_UNIT', 'ч'),
    'MINUTES': () => ls('ALERTS_GROUP_POLICIES_DURATION_MINUTES_UNIT', 'м'),
    'SECONDS': () => ls('ALERTS_GROUP_POLICIES_DURATION_SECONDS_UNIT', 'с'),
};

class AlertsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALERTS_TYPES).isRequired,
        alert: PropTypes.object,
        active: PropTypes.bool,
    };

    static defaultProps = {
        alert: null,
        active: false,
    };

    componentDidMount() {
        const closeBtn = document.querySelector(`.${styles.alertsViewer} .close`);

        if (closeBtn) {
            closeBtn.setAttribute('itemId', 'alerts_close');
        }

        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onClose = () => {
        this.context.history.push(`/alerts/${this.props.type}/${this.context.location.search}`);
    };

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + DURATION_UNITS_MAP[key.toUpperCase()]();
            return `${result}${nextPart} `;
        }, '');

    getAlertContent = (key) => {
        switch (key) {
            case 'raise_time':
                return _.get(this.props.alert, key, null) ? convertUTC0ToLocal(_.get(this.props.alert, key)).format('HH:mm:ss DD.MM.YYYY') : '';
            case 'duration':
                return this.getReadableDuration(_.get(this.props.alert, key, 0));
            case 'notification_text':
                const text = _.get(this.props.alert, key, '');
                const NEW_LINE_SYMBOL = '\n';
                return <ul className={styles.attributesList}>
                    {text.split(NEW_LINE_SYMBOL).map(line => <li>{line}</li>)}
                </ul>;
            case 'notified': {
                const notifications = _.get(this.props.alert, key, []);
                return (
                    notifications.map(notif => (
                        <div className={styles.alertContent}>
                            <Icon icon={`icon-state-${notif.status.toLowerCase()}`}
                                  title={ls(`ALERTS_STATUS_${notif.status.toUpperCase()}`, 'Статус')}
                            />
                            {notif.type}
                        </div>
                    ))
                );
            }
            case 'attributes':
                return <ul
                    className={styles.attributesList}>{_.reduce(_.get(this.props.alert, key, {}), (result, value, key) => {
                    result.push(`${key}=${value}`);
                    return result;
                }, []).map(attr => <li title={attr}>{attr}</li>)}</ul>;
            default:
                return _.get(this.props.alert, key, '');
        }
    };

    render() {
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.alertsViewer}
                >
                    <ModalHeader
                        toggle={this.onClose}
                        className="handle"
                    >
                        {`${ls('ALERTS_GROUP_POLICIES_ALERTS_VIEWER_TITLE', 'Детальная информация аварии №')}${this.getAlertContent('id')}`}
                    </ModalHeader>
                    <ModalBody>
                        <div className={styles.alertsViewerContent}>
                            {infoScheme.map(key => (
                                <div key={key} className={styles.alertsViewerRow}>
                                    <div>{ls(`ALERTS_GROUP_POLICIES_ALERTS_VIEWER_${key.toUpperCase()}`, DEFAULT_TEXTS[key.toUpperCase()])}</div>
                                    <div>{this.getAlertContent(key)}</div>
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

export default AlertsViewer;