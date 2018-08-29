import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';


class Chip extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        onRemove: PropTypes.func,
        style: PropTypes.object,
    };

    static defaultProps = {
        title: '',
        onRemove: () => null,
        style: null,
    };


    render() {
        const { title, style, onRemove } = this.props;
        return <div className={styles.chipContainer} style={style}>
            <div title={title}>{title}</div>
            <div onClick={onRemove}
                 className={styles.closeButton}
            >
                ×
            </div>
        </div>
    }
}

export default Chip;
