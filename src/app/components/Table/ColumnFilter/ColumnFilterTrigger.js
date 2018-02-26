import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './trigger.scss';

class ColumnFilterTrigger extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
        onClick: PropTypes.func,
        className: PropTypes.string,
    }

    static defaultProps = {
        active: false,
        onClick: () => null,
        className: '',
    }

    render() {
        const classes = classNames(
            styles.columnFilterTrigger,
            this.props.className,
        );
        return (
            this.props.active && <div className={classes} onClick={this.props.onClick} />
        );
    }
}

export default ColumnFilterTrigger;
