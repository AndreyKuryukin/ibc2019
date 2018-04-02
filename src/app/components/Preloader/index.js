import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ls from 'i18n';
import styles from './styles.scss';

class Prealoder extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
        text: PropTypes.string,
        children: PropTypes.node,
    };

    static defaultProps = {
        active: false,
        text: ls('PRELOADER_DEFAULT_TEXT', 'Загрузка'),
        children: null,
    };

    render() {
        const { active, text, children } = this.props;

        return (
            <div className={classNames({
                [styles.preloaderWrapper]: true,
                [styles.active]: active,
            })}>
                <div className={styles.layout}>
                    <div>{text}</div>
                </div>
                {children}
            </div>
        );
    }
}

export default Prealoder;
