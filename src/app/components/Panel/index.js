import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.scss';

class Panel extends React.PureComponent {
    static propTypes = {
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        className: PropTypes.string,
        style: PropTypes.object,
        bodyStyle: PropTypes.object,
        horizontal: PropTypes.bool,
        children: PropTypes.node,
    };

    static defaultProps = {
        title: '',
        className: '',
        style: null,
        bodyStyle: null,
        horizontal: false,
        children: null,
    };

    render() {
        const { title, className, style, bodyStyle, children, horizontal } = this.props;

        return (
            <div className={classnames(styles.panel, className)} style={style}>
                <div className={styles.panelHeader}>{title}</div>
                <div className={classnames(styles.panelBody, { [styles.horizontal]: horizontal })} style={bodyStyle}>{children}</div>
            </div>
        );
    }
}

export default Panel;
