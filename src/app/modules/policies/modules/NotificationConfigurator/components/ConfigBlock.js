import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class ConfigBlock extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        onRemove: () => null,
    };

    render() {
        return (
            <div className={styles.configBlock}>
                <div className={styles.configContentRow}>
                    <div className={styles.configBlockContent}>
                        {this.props.children}
                    </div>
                    <span
                        className={styles.configBlockRemove}
                        onClick={this.props.onRemove}
                    >×</span>
                </div>
            </div>
        );
    }
}

export default ConfigBlock;