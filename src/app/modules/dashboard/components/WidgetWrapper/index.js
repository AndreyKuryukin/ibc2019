import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';
import BackLink from './BackLink';

class WidgetWrapper extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.node,
        backLink: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.node,
    };

    render() {
        const { className, title, backLink, style, children } = this.props;

        return (
            <div className={cn(styles.widgetWrapper, className)} style={style}>
                {(title !== undefined || backLink !== undefined) && (
                    <div className={styles.head}>
                        <h3 className={styles.title}>
                            {backLink !== undefined && <BackLink to={backLink} className={styles.backLink} />}
                            {title}
                        </h3>
                    </div>
                )}
                <div className={styles.body}>{children}</div>
            </div>
        )
    }
}

export default WidgetWrapper;
