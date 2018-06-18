import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from '../styles.scss';
import KQI from '../../KQI';

class RegionInfo extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        coords: PropTypes.shape({
            left: PropTypes.string.isRequired,
            top: PropTypes.string.isRequired,
        }).isRequired,
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        plan: PropTypes.number,
        kqi: PropTypes.number,
        isActive: PropTypes.bool,
        onMouseEnter: PropTypes.func.isRequired,
        onMouseLeave: PropTypes.func.isRequired,
    };

    onMouseEnter = () => {
        this.props.onMouseEnter(this.props.id);
    };
    onMouseLeave = () => {
        this.props.onMouseLeave(this.props.id);
    };

    getIsPositive() {
        const { kqi, plan } = this.props;
        return kqi !== undefined && plan !== null && kqi > plan;
    }
    getIsNegative() {
        const { kqi, plan } = this.props;
        return kqi !== undefined && plan !== null && kqi < plan;
    }

    renderTooltip() {
        return (
            <div className={styles.inner}>
                <div className={styles.mapTooltip}>
                    <div className={styles.inner}>
                        <p className={styles.title}>{this.props.name}</p>
                        <KQI
                            className={styles.kqi}
                            type={this.props.type}
                            value={this.props.kqi}
                            positive={this.getIsPositive()}
                            negative={this.getIsNegative()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { coords, plan, kqi } = this.props;

        return (
            <div
                className={cn(styles.info, {
                    [styles.active]: this.props.isActive,
                    [styles.positive]: this.getIsPositive(),
                    [styles.negative]: this.getIsNegative(),
                })}
                style={coords}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >{this.renderTooltip()}</div>
        );
    }
}

export default RegionInfo;
