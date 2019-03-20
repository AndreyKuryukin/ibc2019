import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import KQIRange from './KQIRange';
import styles from './subscribers-card.scss';
import ls from "i18n";

class CardHead extends React.Component {
    static propTypes = {
        subscriber: PropTypes.shape({
            service_id: PropTypes.string.isRequired,
            san: PropTypes.string.isRequired,
            nls: PropTypes.string.isRequired,
        }),
    };

    render() {
        const {subscriber} = this.props;
        const info = subscriber === null ? null : [
            ['Service ID', subscriber.service_id],
            ['SAN', subscriber.san],
            [ls('PERSONAL_ACCOUNT_NUMBER', 'Personal account number'), subscriber.nls],
        ].map((pair, i) => <span key={i}>{pair.join(': ')}</span>);

        return (
            <div className={styles.head}>
                <div className={styles.subscriber}>
                    <b>{ls('SUBSCRIBER_CARD','Карточка клиента')}</b> <span className={styles.info}>{info}</span>
                </div>
            </div>
        )
    }
}

export default CardHead;
