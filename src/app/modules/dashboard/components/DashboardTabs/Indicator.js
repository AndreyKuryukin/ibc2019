import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Indicator extends React.PureComponent {
    static propTypes = {
        current: PropTypes.number,
        total: PropTypes.number,
    };

    render() {
        const { current, total } = this.props;

        const flexBasis = current / (total - 1) * 100 + '%';

        return (
            <div className={styles.indicator}>
                <div
                    className={styles.offset}
                    style={{ flexBasis }}
                />
            </div>
        )
    }
}

export default Indicator;
