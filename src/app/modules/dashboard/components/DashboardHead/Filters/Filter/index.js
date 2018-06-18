import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';
import Field from '../../../../../../components/Field';
import Checkbox from '../../../../../../components/Checkbox';

const CheckboxField = (props) => (
    <Field
        id={props.option.value}
        labelText={props.option.label}
        labelAlign="right"
        splitter=""
        style={{ marginTop: 0 }}
        labelStyle={{
            marginLeft: 7,
            fontSize: '1.1em',
        }}
    >
        <Checkbox
            id={props.option.value}
            checked={props.values.includes(props.option.value)}
            onChange={props.onChange}
        />
    </Field>
);

class Filter extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })).isRequired,
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChange: PropTypes.func,
    };

    render() {
        const { className, title, options, values, onChange } = this.props;

        const enabled = values.length !== 0;

        return (
            <div className={cn(styles.dashboardFilter, className, { [styles.enabled]: enabled })}>
                <p>{title}:</p>
                <div>
                    {options.map(option => (
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
