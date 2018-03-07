import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.scss';

class Panel extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        bodyStyle: PropTypes.object,
        children: PropTypes.node,
    };

    static defaultProps = {
        title: '',
        className: '',
        style: null,
        bodyStyle: null,
        children: null,
    };

    render() {
        const { title, className, style, bodyStyle, children } = this.props;

        return (
            <div className={classnames(styles.panel, className)} style={style}>
                <div className={styles.panelHeader}>{title}</div>
                <div className={styles.panelBody} style={bodyStyle}>{children}</div>
            </div>
        );
    }
}

export default Panel;
