import React from 'react';
import ls from 'i18n';
import Field from '../../../../../../components/Field';
import Checkbox from '../../../../../../components/Checkbox';

const labelStyle = {
    marginLeft: 7,
    fontSize: '1.1em',
};

const style = { marginTop: 0 };

const CheckboxField = props => (
    <Field
        id={props.option.value}
        labelText={ls(props.option.value, props.option.label)}
        labelAlign="right"
        splitter=""
        style={style}
        labelStyle={labelStyle}
    >
        <Checkbox
            itemId={`${props.id}_${props.option.value.toLowerCase()}_check`}
            id={props.option.value}
            checked={props.values.includes(props.option.value)}
            onChange={props.onChange}
        />
    </Field>
);

export default CheckboxField;
