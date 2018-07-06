import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';
import ls from '../../../../../i18n';
import KQI from '../KQI';

class Tab extends React.PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired,
        href: PropTypes.string,
        value: PropTypes.number,
        previous: PropTypes.number,
        expected: PropTypes.number,
        primary: PropTypes.bool,
    };

    renderDynamic(label, absoluteValue) {
        if (absoluteValue === undefined || this.props.value === undefined) {
            return (
                <span>
                    {label}&nbsp;
                    <span>{ls('NOT_AVAILABLE', 'Н/Д')}</span>
                </span>
            );
        }

        const value = this.props.value - absoluteValue;
        const className = cn({
            [styles.positive]: value > 0,
            [styles.negative]: value < 0,
        });

        const sign = ['-', '', '+'][Math.sign(value) + 1];
        const number = Math.abs(value).toFixed(1);

        return (
            <span className={className}>
                {label}&nbsp;
                <span>{sign}{number}%</span>
            </span>
        );
    }

    renderContent() {
        const { previous, expected, primary } = this.props;

        return (
            <div className={cn(styles.tab, {
                [styles.primary]: primary,
            })}>
                <KQI
                    type={this.props.type}
                    value={this.props.value}
                    positive={this.props.value > expected}
                    negative={this.props.value < expected}
                />
                <div className={styles.dynamics}>
                    {this.renderDynamic(ls('DASHBOARD_PREV_PERIOD', 'Прошлый период:'), previous)}
                    {this.renderDynamic(ls('DASHBOARD_EXPECTED', 'План:'), expected)}
                </div>
            </div>
        );
    }

    render() {
        const { href } = this.props;

        if (href === null) {
            return this.renderContent();
        }

        return (
            <Link to={href} className={styles.tabLink}>{this.renderContent()}</Link>
        );
    }
}

export default Tab;
