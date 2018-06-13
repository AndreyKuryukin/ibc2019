import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';


class ChipList extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        onRemove: PropTypes.func,

    };

    static defaultProps = {
        title: '',
        onRemove: () => null,
    };


    render() {
        const { title } = this.props;
        return <div className={styles.chipContainer}>
            <div>{title}</div>
            <div onClick={this.props.onRemove}
                 className={styles.closeButton}
            >
                ×
            </div>
        </div>
    }
}

export default ChipList;
