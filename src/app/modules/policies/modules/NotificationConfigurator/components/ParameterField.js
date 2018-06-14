import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import memoize from 'memoizejs';
import Select from '../../../../../components/Select';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import MultiselectGrid from './MultiselectGrid';
import styles from './styles.scss';

class ParameterField extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['string', 'integer', 'enum']).isRequired,
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        values: PropTypes.array,
        required: PropTypes.bool,
        multiple: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        name: '',
        value: '',
        values: [],
        required: false,
        multiple: false,
        onChange: () => null,
    };

    static mapOptions = memoize(opts => opts.map(({ value, name }) => ({
        value,
        title: name,
    })));

    onChangeInput = (e) => {
        this.props.onChange(_.get(e, 'target.value', ''));
    };

    render() {
        const {
            id,
            type,
            name,
            value,
            values,
            required,
            multiple,
            onChange,
        } = this.props;

        return (
            <Field
                id={id}
                labelText={name}
                inputWidth="70%"
                labelWidth="30%"
                required={required}
            >
                {type === 'integer' && <Input
                    id={id}
                    value={value}
                    onChange={this.onChangeInput}
                />}
                {type === 'string' && <Input
                    id={id}
                    value={value}
                    onChange={this.onChangeInput}
                />}
                {type === 'enum' && (multiple ? (
                    <MultiselectGrid
                        id={id}
                        values={values}
                        checked={value}
                        onChange={onChange}
                    />
                ) : (
                    <Select
                        id={id}
                        options={ParameterField.mapOptions(values)}
                        value={value[0] || ''}
                        onChange={onChange}
                    />
                ))}
            </Field>
        );
    }
}

export default ParameterField;
