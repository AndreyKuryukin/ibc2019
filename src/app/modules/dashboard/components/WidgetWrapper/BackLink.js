import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './styles.scss';
import ls from '../../../../../i18n/index';

class BackLink extends React.PureComponent {
    static propTypes = {
        to: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Link
                itemId="dashboard_back"
                className={styles.backLink}
                to={this.props.to}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10">
                    <path
                        fill="none"
                        // fill-rule="evenodd"
                        stroke="#FD7F00"
                        d="M6 10L1 5l5-5"
                    />
                </svg>
                {' ' + ls('BACK', 'Назад')}
            </Link>
        );
    }
}

export default BackLink;
