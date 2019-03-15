import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import cn from 'classnames';
import styles from './tabs.scss';

class Tabs extends React.Component {
    static propTypes = {
        activeTabId: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.shape({
            props: PropTypes.shape({
                id: PropTypes.string.isRequired,
                link: PropTypes.string.isRequired,
                tabtitle: PropTypes.node.isRequired,
            }).isRequired,
        })),
    };

    render() {
        return (
            <div className={styles.tabs}>
                <div className={styles.head}>
                    {React.Children.map(this.props.children, child => (
                        <Link
                            to={child.props.link}
                            className={cn(styles.tab, {
                                [styles.active]: child.props.id === this.props.activeTabId,
                            })}
                        >{child.props.tabtitle}</Link>
                    ))}
                </div>
            </div>
        );
    }
}

export default Tabs;
