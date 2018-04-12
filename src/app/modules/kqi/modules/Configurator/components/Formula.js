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
        numeratorPattern: ls('KPI_NUMERATOR_PATTERN', 'Σ (измерений при которых: {{kpi-object_type}}.{{kpi_parameter_type}} {{operator}} {{level}})'),
        denominatorPattern: ls('KPI_DENOMINATOR_PATTERN', 'количество измерений {{kpi-object_type}}.{{kpi_parameter_type}}'),
        multiplierPattern: ls('KPI_MULTIPLIER_PATTERN', 'Х 100'),
        keyMap: {
            ['kpi-object_type']: ls('KPI_OBJECT_TYPE', '<Тип объекта>'),
            kpi_parameter_type: ls('KPI_PARAMETER_TYPE', '<Параметер>'),
            operator: ls('KPI_OPERATOR_TYPE', '<Оператор>'),
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
