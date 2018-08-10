import React from 'react';
import ls from 'i18n';
import Field from '../../../../../../components/Field';
import Radio from '../../../../../../components/Radio';

const RadioField = (props) => (
    <Field
        id={props.option.value}
        labelText={ls(props.option.value, props.option.label)}
        labelAlign="right"
        splitter=""
        style={{ marginTop: 0 }}
        labelStyle={{
            marginLeft: 7,
            fontSize: '1.1em',
        }}
    >
        <Radio
            itemId={`${props.name}_${props.option.value.toLowerCase()}_radio`}
            id={props.option.value}
            name={props.name}
            checked={props.values.includes(props.option.value)}
            onChange={props.onChange}
        />
    </Field>
);

export default RadioField;
