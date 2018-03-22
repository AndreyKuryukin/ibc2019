import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

import * as _ from "lodash";
import ls from "i18n";
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';


class Conjunction extends React.PureComponent {
    static propTypes = {
        conjunction: PropTypes.shape({
            value: PropTypes.string
        }),
        parameterList: PropTypes.array,
        objectTypeList: PropTypes.array,
        operatorList: PropTypes.array,
        onChange: PropTypes.func,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        conjunction: {
            value: ''
        },
        parameterList: [],
        objectTypeList: [],
        operatorList: [],
        onChange: () => null,
        onRemove: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.parseConjunctionString(props.conjunction.value)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.conjunction !== nextProps.conjunction) {
            const conjunction = { ..._.get(nextProps, 'conjunction', {}) };
            conjunction.value = this.parseConjunctionString(conjunction.value);
            this.setState(conjunction)
        }
    }

    setConjunctionProperty = (path, value) => {
        const conjunction = _.set({ ...this.state }, path, value);
        this.setState(conjunction);
        conjunction.value = this.composeConjunctionString(conjunction.value);

        this.props.onChange(conjunction)
    };

    parseConjunctionString = (conjunctionString = '') => {
        const parts = conjunctionString.split(' ');
        const parameter = _.get(parts, '0', '').split('.');
        const objectType = _.get(parameter, '0');
        const parameterType = _.get(parameter, '1');
        const operator = _.get(parts, '1');
        const value = _.get(parts, '2');
        return {
            objectType, parameterType, operator, value
        }
    };

    composeConjunctionString = (object) => {
        const { objectType = '', parameterType = '', operator = '', value = '' } = object;
        const conjString = `${objectType}${parameterType ? '.' : ''}${parameterType} ${operator} ${value}`;
        return conjString.trim();
    };

    mapObjectTypes = objectTypes => objectTypes.map(type => ({ title: type, value: type }));

    mapParameters = parameters => parameters.map(param => ({ title: param, value: param }));

    mapOperators = operators => operators.map(operator => ({ title: operator, value: operator }));

    render() {
        const { conjunction = {
            value: this.parseConjunctionString(_.get(this.props, 'conjunction.value'))
        } } = this.state;
        const { objectTypeList, parameterList, operatorList } = this.props;
        return <div className={styles.conditionBlock}>
            <div className={styles.parameters}>
                <Field
                    id="object"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Тип объекта')}:`}
                    labelWidth="30%"
                    inputWidth="70%"
                >
                    <Select
                        id="object"
                        type="select"
                        value={_.get(conjunction, 'value.objectType')}
                        defaultValue="STB"
                        options={this.mapObjectTypes(objectTypeList)}
                        onChange={(value) => this.setConjunctionProperty('value.objectType', value)}
                    />
                </Field>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ width: '60%' }}>
                        <Field
                            id="parameter"
                            labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Параметр')}:`}
                        >
                            <Select
                                id="parameter"
                                type="select"
                                value={_.get(conjunction, 'value.parameterType')}
                                options={this.mapParameters(parameterList)}
                                onChange={(value) => this.setConjunctionProperty('value.parameterType', value)}
                            />
                        </Field>
                    </div>
                    <div style={{ width: '20%', paddingLeft: 5 }}>
                        <Select
                            type="select"
                            placeholder={''}
                            value={_.get(conjunction, 'value.operator')}
                            options={this.mapOperators(operatorList)}
                            onChange={(value) => this.setConjunctionProperty('value.operator', value)}
                        />
                    </div>
                    <div style={{ width: '20%', paddingLeft: 5 }}>
                        <Input
                            name="value"
                            value={_.get(conjunction, 'value.value')}
                            type="number"
                            onChange={(event) => this.setConjunctionProperty('value.value', _.get(event, 'currentTarget.value'))}
                        />
                    </div>
                </div>
            </div>
            <span className={styles.remove}
                  onClick={this.props.onRemove}
            >×</span>
        </div>
    }
}

export default Conjunction;
