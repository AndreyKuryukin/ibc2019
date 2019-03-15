import React from 'react';
import PropTypes from 'prop-types';
import styles from './topology.scss';
import ACCESS from './icons/access.svg';
import BASE from './icons/base.svg';
import COMMUTATOR from './icons/commutator.svg';
import NETWORK from './icons/network.svg';
import RE_ROUTER from './icons/re-router.svg';
import ROUTER from './icons/router.svg';
import STB from './icons/stb.svg';
import ACCESS_ALERT from './icons/access_alert.svg';
import BASE_ALERT from './icons/base_alert.svg';
import COMMUTATOR_ALERT from './icons/commutator_alert.svg';
import RE_ROUTER_ALERT from './icons/re-router_alert.svg';
import ROUTER_ALERT from './icons/re-router_alert.svg';
import STB_ALERT from './icons/stb_alert.svg';
import ACCESS_DISABLED from './icons/access_disabled.svg';
import COMMUTATOR_DISABLED from './icons/commutator_disabled.svg';
import RE_ROUTER_DISABLED from './icons/re-router_disabled.svg';

export const ICONS = {
    ACCESS,
    BASE,
    COMMUTATOR,
    NETWORK,
    RE_ROUTER,
    ROUTER,
    STB,
};
const ALERT_ICONS = {
    [ICONS.ACCESS]: ACCESS_ALERT,
    [ICONS.BASE]: BASE_ALERT,
    [ICONS.COMMUTATOR]: COMMUTATOR_ALERT,
    [ICONS.RE_ROUTER]: RE_ROUTER_ALERT,
    [ICONS.ROUTER]: ROUTER_ALERT,
    [ICONS.STB]: STB_ALERT,
};
const DISABLED_ICONS = {
    [ICONS.ACCESS]: ACCESS_DISABLED,
    [ICONS.COMMUTATOR]: COMMUTATOR_DISABLED,
    [ICONS.RE_ROUTER]: RE_ROUTER_DISABLED,
};

class Icon extends React.Component {
    static propTypes = {
        src: PropTypes.oneOf(Object.values(ICONS)),
        alert: PropTypes.bool.isRequired,
    };

    render() {
        let src = this.props.src;
        if (this.props.alert && ALERT_ICONS[this.props.src] !== undefined) {
            src = ALERT_ICONS[this.props.src];
        }
        if (this.props.disabled && DISABLED_ICONS[this.props.src] !== undefined) {
            src = DISABLED_ICONS[this.props.src];
        }

        return (
            <img
                className={styles.icon}
                src={src}
            />
        );
    }
}

export default Icon;
