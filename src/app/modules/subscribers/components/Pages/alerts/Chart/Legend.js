import React from 'react';
import PropTypes from 'prop-types';
import styles from './alerts-chart.scss';
import {background} from './util';
import ls from "i18n";

class Legend extends React.Component {
    static propTypes = {
        data: PropTypes.objectOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            color: PropTypes.string.isRequried,
        })).isRequired,
    };

    render() {
        return (
            <div className={styles.legend}>
                {Object.values(this.props.data).map(group => (
                    <div
                        key={group.id}
                        className={styles.item}
                    >
                        <div
                            className={styles.icon}
                            style={{background: background(group.color)}}
                        />
                        <span>{group.name}</span>
                    </div>
                ))}
                <div className={styles.item}>
                    <div
                        className={styles.icon}
                        style={{background: background('transparent', true)}}
                    />
                    <span>{ls('CLOSED_INCIDENTS', 'Закрытые аварии')}</span>
                </div>
            </div>
        );
    }
}

export default Legend;
