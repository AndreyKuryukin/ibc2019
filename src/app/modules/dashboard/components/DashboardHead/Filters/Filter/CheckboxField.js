import React from 'react';
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

export default CheckboxField;
