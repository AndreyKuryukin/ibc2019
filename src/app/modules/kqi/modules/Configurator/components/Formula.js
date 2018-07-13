import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import ls from "i18n";
import * as _ from "lodash";
import { OPERATOR_TYPES } from "../constants";

const KPI_DEFAULTS = {
    PARAMETER_TYPE: '<Параметр>',
    OPERATOR_TYPE: '<Оператор>',
    OBJECT_TYPE: '<Тип объекта>',
    LEVEL: '<Значение>'
}

class Formula extends React.PureComponent {
    static propTypes = {
        config: PropTypes.object,
    };

    static defaultProps = {
        config: PropTypes.object,
    };


    replaceByPattern = (config, pattern) => {
        return _.reduce(config, (result, value, key) => {
            const defaultParamString = KPI_DEFAULTS[key.toUpperCase()];
            if (key === 'parameter_type') {
                return result.replace(`{{${key}}}`, _.get(value, 'name') || ls(`KPI_${key.toUpperCase()}`, defaultParamString));
            }
            if (key === 'operator_type') {
                return result.replace(`{{${key}}}`, OPERATOR_TYPES[value] || ls(`KPI_${key.toUpperCase()}`, defaultParamString));
            }
           return result.replace(`{{${key}}}`, value || ls(`KPI_${key.toUpperCase()}`, defaultParamString));
        }, pattern);
    };

    render() {
        const { config } = this.props;
        return <div className={styles.kpiFormila}>
            <div className={styles.kpiConfigTitle}>{ls('KPI_FORMULA_TITLE', 'Формула вычисления KQI (%)')}</div>
            <div className={styles.fractionContainer}>
                <div className={styles.fractionItself}>
                    <div className={styles.fractionNumerator}>
                        {this.replaceByPattern(
                            config,
                            ls('KPI_NUMERATOR_PATTERN', 'Σ (измерений при которых: {{object_type}}.{{parameter_type}} {{operator_type}} {{level}})')
                        )}
                    </div>
                    <div
                        className={styles.fractionDenominator}
                    >{this.replaceByPattern(
                        config,
                        ls('KPI_DENOMINATOR_PATTERN', 'количество измерений {{object_type}}.{{parameter_type}}')
                    )}</div>
                </div>
                <div
                    className={styles.fractionMultiplier}
                >{this.replaceByPattern(config, ls('KPI_MULTIPLIER_PATTERN', 'Х 100'))}
                </div>
            </div>

        </div>
    }
}

export default Formula;
