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
        style: PropTypes.object,
    };

    static defaultProps = {
        title: '',
        disabled: false,
        style: null,
        onClick: () => null,
    };

    render() {
        const {icon, disabled, ...rest} = this.props;
        return (
            <div
                className={classnames(
                    styles.iconBlock,
                    { [styles.iconDisabled]: disabled },
                    icon
                )}
                {...rest}
            />
        );
    }
}

export default Icon;
