import React from 'react';
import PropTypes from 'prop-types';
import styles from './icon.scss';
import classnames from "classnames";

class Icon extends React.PureComponent {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        title: PropTypes.string,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        disabled: false,
        onClick: () => null,
    }

    render() {
        return (
            <div
                className={classnames(styles.iconBlock, this.props.icon)}
                onClick={this.props.onClick}
                title={this.props.title}
            />
        );
    }
}

export default Icon;
