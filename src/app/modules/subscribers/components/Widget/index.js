import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import styles from './widget.scss';
import classnames from "classnames";

class Widget extends React.Component {
    static propTypes = {
        title: PropTypes.node,
        controls: PropTypes.node,
        detailsLink: PropTypes.string,
        children: PropTypes.node,
        className: PropTypes.string,
    };

    render() {
        const {title, controls, detailsLink, className} = this.props;

        const hasTitle = title !== undefined;
        const isHeadDisplayed = hasTitle || !!controls;

        return (
            <div className={classnames(styles.widget, className)}>
                {isHeadDisplayed && (
                    <div className={styles.head}>
                        {hasTitle && (
                            <span className={styles.title}>
                                {title}
                                {typeof detailsLink === 'string' && <Link to={detailsLink}>Подробнее</Link>}
                            </span>
                        )}
                        {controls && (
                            <div className={styles.controls}>
                                {controls}
                            </div>
                        )}
                    </div>
                )}
                {this.props.children !== undefined && (
                    <div className={styles.body}>
                        {this.props.children}
                    </div>
                )}
            </div>
        )
    }
}

export default Widget;
