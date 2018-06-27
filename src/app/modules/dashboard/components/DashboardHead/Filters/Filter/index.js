import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';
import RadioField from './RadioField';
import CheckboxField from './CheckboxField';

class Filter extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['bool', 'radio']),
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })).isRequired,
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChange: PropTypes.func,
    };
    static defaultProps = {
        type: 'bool',
    };

    render() {
        const { className, name, title, options, values, type, onChange } = this.props;

        const enabled = values.length !== 0;

        return (
            <div className={cn(styles.dashboardFilter, className, { [styles.enabled]: enabled })}>
                <p>{title}:</p>
                <div>
                    {options.map(option => type === 'radio' ? (
                        <RadioField
                            key={option.value}
                            name={`dashboard_filter_${name}`}
                            option={option}
                            values={values}
                            onChange={typeof onChange === 'function' ? (value) => onChange(option.value, value) : undefined}
                        />
                    ) : (
                        <CheckboxField
                            key={option.value}
                            option={option}
                            values={values}
                            onChange={typeof onChange === 'function' ? (value) => onChange(option.value, value) : undefined}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default Filter;
