import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import ls from "i18n";
import * as _ from "lodash";
import { OPERATOR_TYPES } from "../constants";

class Formula extends React.PureComponent {
    static propTypes = {
        config: PropTypes.object,
    };

    static defaultProps = {
        config: PropTypes.object,
    };


    replaceByPattern = (config, pattern) => {
        return _.reduce(config, (result, value, key) => {

            if (key === 'parameter_type') {
                return result.replace(`{{${key}}}`, _.get(value, 'name') || ls(`KPI_${key.toUpperCase()}`, '<>'))
            }
            if (key === 'operator_type') {
                return result.replace(`{{${key}}}`, OPERATOR_TYPES[value] || ls(`KPI_${key.toUpperCase()}`, '<>'))
            }
           return result.replace(`{{${key}}}`, value || ls(`KPI_${key.toUpperCase()}`, '<>'))
        }, pattern)
    };

    render() {
        const { config } = this.props;
        return <div className={styles.kpiFormila}>
            <div className={styles.kpiConfigTitle}>{ls('KPI_FORMULA_TITLE', 'Формула вычисления KQI (%)')}</div>
            <div className={styles.fractionContainer}>
                <div className={styles.fractionItself}>
                    <div className={styles.fractionNumerator}>
                        {this.replaceByPattern(config, ls('KPI_NUMERATOR_PATTERN', ''))}
                    </div>
                    <div
                        className={styles.fractionDenominator}>{this.replaceByPattern(config, ls('KPI_DENOMINATOR_PATTERN', ''))}
                    </div>
                </div>
                <div
                    className={styles.fractionMultiplier}>{this.replaceByPattern(config, ls('KPI_MULTIPLIER_PATTERN', ''))}
                </div>
            </div>

        </div>
    }
}

export default Formula;
