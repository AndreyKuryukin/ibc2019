import React from 'react';
import PropTypes from 'prop-types';
import styles from './icon.scss';
import classnames from "classnames";

class Icon extends React.PureComponent {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        itemId: PropTypes.string,
        title: PropTypes.string,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
        style: PropTypes.object,
    };

    static defaultProps = {
        itemId: '',
        disabled: false,
        style: null,
        onClick: () => null,
    };

    render() {
        const { icon, title, disabled, ...rest } = this.props;

        return (
            <div
                title={title}
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
