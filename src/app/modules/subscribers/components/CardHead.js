import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import KQIRange from './KQIRange';
import styles from './subscribers-card.scss';

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
            ['Л/С', subscriber.nls],
        ].map((pair, i) => <span key={i}>{pair.join(': ')}</span>);

        return (
            <div className={styles.head}>
                <div className={styles.subscriber}>
                    <b>Карточка клиента</b> <span className={styles.info}>{info}</span>
                </div>
                <div><b>Период </b> <KQIRange className={cn(styles['kqi-range'], styles['white-btn-group'])}/></div>
            </div>
        )
    }
}

export default CardHead;
