import React from 'react';
import PropTypes from 'prop-types';
import styles from './topology.scss';

export default class Arrow extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
    };

    render() {
        const {index} = this.props;

        let h = 0;
        if (index > 0) h = 70;
        let v = 0;
        if (index > 0) v += 30;
        if (index > 1) v += 85 * (index - 1);

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={h + 26}
                height={v + 8}
                viewBox={`${-h} ${-v} ${h + 26} ${v + 8}`}
                className={styles.arrow}
                style={{marginTop: -v}}
            >
                <g fill="none" fillRule="evenodd" stroke="#767676" strokeLinecap="square">
                    <rect
                        x="-69"
                        y={-(v + 85)}
                        width="130"
                        height={v + 89}
                        rx="20"
                        ry="20"
                    />
                    <path fillRule="nonzero" d="M.5 4.25h25"/>
                    <path d="M14.7 7.25l10.8-3-10.8-3"/>
                </g>
            </svg>
        );
    }
}
