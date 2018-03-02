import React from 'react';
import PropTypes from 'prop-types';
import styles from './icon.scss';
import classnames from "classnames";

class Icon extends React.PureComponent {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    render() {
        return (
            <div className={styles.wrapper}>
                <div
                    className={classnames(styles.image, this.props.icon)}
                    onClick={this.props.onClick}
                />
            </div>
        );
    }
}

export default Icon;
