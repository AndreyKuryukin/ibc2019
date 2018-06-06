import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';
import Tab from './Tab';
import Indicator from './Indicator';

class DashboardTabs extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        tabs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            type: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
            value: PropTypes.number,
            previous: PropTypes.number,
            expected: PropTypes.number,
        })),
        selectedTabId: PropTypes.string,
    };

    render() {
        const { className, tabs, selectedTabId } = this.props;
        const selectedTabIndex = this.props.tabs.findIndex(tab => tab.id === selectedTabId);

        return (
            <div className={cn(styles.dashboardTabs, className)}>
                <div className={styles.tabs}>
                    {tabs.reduce((result, tab, i) => {
                        if (i !== 0) {
                            result.push(
                                <div
                                    key={`separator-${i}`}
                                    className={styles.separator}
                                />
                            );
                        }

                        result.push(
                            <Tab
                                key={tab.id}
                                type={tab.type}
                                href={tab.href}
                                value={tab.value}
                                previous={tab.previous}
                                expected={tab.expected}
                            />
                        );

                        return result;
                    }, [])}
                </div>
                {selectedTabIndex !== -1 && (
                    <Indicator
                        current={selectedTabIndex}
                        total={tabs.length}
                    />
                )}
            </div>
        );
    }
}

export default DashboardTabs;
