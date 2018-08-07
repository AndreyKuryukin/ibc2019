import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from '../styles.scss';
import ls from 'i18n';

const Info = ({ name, coords, kqi, plan, showPoint, mouseEnter, mouseLeave }) => (
    <div
        className={cn(styles.mrfinfo, {
            [styles.positive]: plan < kqi,
            [styles.negative]: plan > kqi,
        })}
        style={coords}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
    >
        <span className="name">{name}</span>
        {kqi === undefined ? (
            <span className={styles.value}>{ls('NOT_AVAILABLE', 'Н/Д')}</span>
        ) : (
            <span className="value">{kqi.toFixed(2)} <span>%</span></span>
        )}
        {showPoint && <span className="point"></span>}
    </div>
);

Info.propTypes = {
    name: PropTypes.string.isRequired,
    coords: PropTypes.shape({
        left: PropTypes.string.isRequired,
        top: PropTypes.string.isRequired,
    }).isRequired,
    kqi: PropTypes.number,
    plan: PropTypes.number,
    showPoint: PropTypes.bool,
    mouseEnter: PropTypes.func,
    mouseLeave: PropTypes.func,
};

Info.defaultProps = {
    kqi: undefined,
    plan: undefined,
    showPoint: false,
};

export default Info;