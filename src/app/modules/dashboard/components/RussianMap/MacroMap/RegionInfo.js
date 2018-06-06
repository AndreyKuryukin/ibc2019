import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import styles from '../styles.scss';

class RegionInfo extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        href: PropTypes.string,
        coords: PropTypes.shape({
            left: PropTypes.string.isRequired,
            top: PropTypes.string.isRequired,
        }).isRequired,
        kqi: PropTypes.number,
        plan: PropTypes.number,
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

    renderInfo() {
        const {
            name,
            coords,
            kqi,
            plan,
        } = this.props;

        return (
            <div
                className={cn(styles.mrfinfo, {
                    [styles.positive]: plan < kqi,
                    [styles.negative]: plan > kqi,
                })}
                style={coords}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <span className="name">{name}</span>
                {kqi === undefined ? (
                    <span className={styles.value}>N/A</span>
                ) : (
                    <span className="value">{kqi.toFixed(2)} <span>%</span></span>
                )}
            </div>
        );
    }

    render() {
        const {
            href,
            isActive,
        } = this.props;

        if (href === undefined) {
            return this.renderInfo();
        }

        return (
            <Link
                to={href}
                className={cn({ [styles.active]: isActive })}
            >{this.renderInfo()}</Link>
        );
    }
}

export default RegionInfo;
