import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import ls from "i18n";
import * as _ from "lodash";

class Formula extends React.PureComponent {
    static propTypes = {
        config: PropTypes.object,
        title: PropTypes.string,
    };

    static defaultProps = {
        config: PropTypes.object,
        title: ls('KPI_FORMULA_TITLE', 'Формула вычисления KQI (%)'),
        numeratorPattern: ls('KPI_NUMERATOR_PATTERN', 'Σ (измерений при которых: {{object_type}}.{{parameter_type}} {{operator_type}} {{level}})'),
        denominatorPattern: ls('KPI_DENOMINATOR_PATTERN', 'количество измерений {{object_type}}.{{parameter_type}}'),
        multiplierPattern: ls('KPI_MULTIPLIER_PATTERN', 'Х 100'),
        keyMap: {
            object_type: ls('KPI_OBJECT_TYPE', '<Тип объекта>'),
            parameter_type: ls('KPI_PARAMETER_TYPE', '<Параметр>'),
            operator_type: ls('KPI_OPERATOR_TYPE', '<Оператор>'),
            level: ls('KPI_LEVEL', '<Значение>'),
        }
    };

    replaceByPattern = (config, pattern, keyMap = {}) => {
        return _.reduce(config, (result, value, key) => result.replace(`{{${key}}}`, value || keyMap[key]), pattern)
    };

    render() {
        const { config, title, numeratorPattern, denominatorPattern, multiplierPattern, keyMap } = this.props;
        return <div className={styles.kpiFormila}>
            <div className={styles.kpiConfigTitle}>{title}</div>
            <div className={styles.fractionContainer}>
                <div className={styles.fractionItself}>
                    <div className={styles.fractionNumerator}>
                        {this.replaceByPattern(config, numeratorPattern, keyMap)}
                    </div>
                    <div
                        className={styles.fractionDenominator}>{this.replaceByPattern(config, denominatorPattern, keyMap)}
                    </div>
                </div>
                <div
                    className={styles.fractionMultiplier}>{this.replaceByPattern(config, multiplierPattern, keyMap)}
                </div>
            </div>

        </div>
    }
}

export default Formula;
