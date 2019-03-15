import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Preloader from '../../../../components/Preloader';
import styles from './loading-node.scss'

export default class LoadingNode extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        small: PropTypes.bool,
    };
    static defaultProps = {
        small: false,
    };

    render() {
        return (
            <Preloader
                className={cn(styles.loadingNode, this.props.className, {
                    [styles.small]: this.props.small,
                })}
                text=" "
                active
            />
        );
    }
}
