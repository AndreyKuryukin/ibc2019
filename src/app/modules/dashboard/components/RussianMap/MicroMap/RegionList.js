import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from '../styles.scss';

class RegionList extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            kqi: PropTypes.number,
        })),
        plan: PropTypes.number,
        selected: PropTypes.string,
        onHoverIn: PropTypes.func.isRequired,
        onHoverOut: PropTypes.func.isRequired,
    };

    renderKQI(item) {
        if (item.kqi !== undefined) {
            return (
                <span className={styles.kqi}>{(item.kqi || 0).toFixed(2)} %</span>
            );
        }
        return (
            <span className={styles.kqi}>N/A</span>
        );
    }

    render() {
        const { className, items, plan, selected } = this.props;

        return (
            <ul className={className}>
                {items.map(item => (
                    <li
                        key={item.id}
                        className={cn({
                            [styles.selected]: selected === item.id,
                            [styles.positive]: item.kqi !== undefined && plan !== null && item.kqi > plan,
                            [styles.negative]: item.kqi !== undefined && plan !== null && item.kqi < plan,
                        })}
                        onMouseEnter={() => this.props.onHoverIn(item.id)}
                        onMouseLeave={() => this.props.onHoverOut(item.id)}
                    >
                        <span>{item.name}</span>
                        {this.renderKQI(item)}
                    </li>
                ))}
            </ul>
        );
    }
}

export default RegionList;
