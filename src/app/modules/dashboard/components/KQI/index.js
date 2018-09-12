import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';
import ls from 'i18n';

const DEFAULT_INDEXES_BY_TYPE = {
    KAB: 'sub',
    KGS: 'he',
    KSPD: 'net',
};

class KQI extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        type: PropTypes.oneOf(['KAB', 'KGS', 'KSPD']),
        value: PropTypes.number,
        positive: PropTypes.bool,
        only: PropTypes.bool,
        negative: PropTypes.bool,
        precision: PropTypes.number,
        placeholder: PropTypes.string,
    };
    static defaultProps = {
        precision: 2,
        placeholder: null,
    };

    static parseType(type) {
        switch(type) {
            case 'KAB':
            case 'KGS':
            case 'KSPD':
                return [ls('DASHBOARD_PARAMETER_LETTER', 'КQI'), ls(`DASHBOARD_${type}_TYPE_INDEX`, DEFAULT_INDEXES_BY_TYPE[type])];
            default:
                return [null, null];
        }
    };

    render() {
        const {
            className,
            type,
            value,
            positive,
            negative,
            precision,
            only,
            placeholder,
        } = this.props;

        const [parameter, index] = KQI.parseType(type);

        return (
            <p className={cn(styles.KQI, className, {
                [styles.positive]: positive,
                [styles.negative]: negative,
            })}>
                {parameter !== null && !only && (
                    <span className={styles.name}>
                        <span className={styles.parameter}>{parameter}</span>
                        <span className={styles.index}>{index}</span>
                    </span>
                )}
                {typeof value === 'number' ? (
                    <span className={styles.value}>
                        <span className={styles.raw}>{value.toFixed(precision)}</span>
                        <span className={styles.units}>%</span>
                    </span>
                ) : (
                    <span className={styles.value}>{placeholder || ls('NOT_AVAILABLE', 'Н/Д')}</span>
                )}
            </p>
        );
    }
}

export default KQI;
