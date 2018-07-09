import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

import _ from 'lodash';
import ls from "i18n";
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';


class Conjunction extends React.PureComponent {
    static propTypes = {
        conjunction: PropTypes.shape({
            value: PropTypes.object,
        }),
        parameters: PropTypes.array,
        onChange: PropTypes.func,
        onRemove: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        conjunction: {
            value: {},
        },
        parameters: [],
        onChange: () => null,
        onRemove: () => null,
        errors: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.conjunction.value,
            errors: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.conjunction !== nextProps.conjunction) {
            const conjunction = { ..._.get(nextProps, 'conjunction', {}) };

            this.setState({ value: conjunction.value });
        }
        if (this.props.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    setConjunctionProperty = (path, value) => {
        const newValue = _.set({ ...this.state.value }, path, value);
        this.setState({
            value: newValue,
            errors: _.omit(this.state.errors, path),
        });

        this.props.onChange({ value: newValue });
    };

    mapParameters = parameters => parameters.map(param => ({ title: param.name, value: param.name }));

    mapOperators = (parameters, parameter) => {
        const paramCfg = _.find(parameters, { name: parameter });
        if (paramCfg && _.isArray(paramCfg.operators)) {
            return paramCfg.operators.map(operator => ({ title: operator, value: operator }));
        }
        return [];
    };

    getParamCfgByName = (parameters, parameterName) => {
        const defaultCfg = {};
        return _.find(parameters, { name: parameterName }) || defaultCfg;
    };

    renderValueControl = (paramCfg, value, errors) => {
        const Component = paramCfg.type === 'enum' ? Select : Input;
        const params = {
            placeholder: ls('POLICY_CONJUNCTION_VALUE_PLACEHOLDER', 'Значение'),
            maxLength: (paramCfg.type === 'integer' || paramCfg.type === 'KQI') ? 6 : 255,
        };

        if (paramCfg.type === 'enum' && _.isArray(paramCfg.values)) {
            const isNum = _.isNumber(paramCfg.values[0]);
            params.options = paramCfg.values.map(v => ({ title: v, value: v }));
            params.onChange = value => this.setConjunctionProperty('value', isNum ? Number(value) : value);
        } else {
            params.type = 'text';
            params.onChange = (value) => this.setConjunctionProperty('value', value);
            if (paramCfg.type === 'integer' || paramCfg.type === 'KQI') {
                params.maxLength = 6;
                params.type = 'number';
            }
        }

        return (
            <Component
                name="value"
                value={_.get(value, 'value').toString()}
                valid={errors && _.isEmpty(_.get(errors, 'value', null))}
                {...params}
            />
        );
    };

    setParameter = (value, parameters) => {
        const update = { value: { operator: null, value: '' } };
        const parameterCfg = this.getParamCfgByName(parameters, value);
        if (parameterCfg.type === 'KQI') {
            update.value.operator = '>';
        }
        this.setState(update, () => {
            this.setConjunctionProperty('parameterType', value);
        });
    };

    render() {
        const { value, errors } = this.state;
        const { parameters } = this.props;

        const parameter = _.get(value, 'parameterType');
        const paramCfg = this.getParamCfgByName(parameters, parameter);

        return <div className={styles.conditionBlock}>
            <div className={styles.parameters}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ width: '60%' }}>
                        <Field
                            id="parameter"
                            labelText={ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Параметр')}
                            labelWidth="50%"
                            inputWidth="50%"
                        >
                            <Select
                                id="parameter"
                                type="select"
                                placeholder={ls('POLICY_CONJUNCTION_PARAMETER_PLACEHOLDER', 'Параметр')}
                                value={parameter}
                                options={this.mapParameters(parameters)}
                                onChange={(value) => this.setParameter(value, parameters)}
                                valid={errors && _.isEmpty(_.get(errors, 'parameterType', null))}
                            />
                        </Field>
                    </div>
                    {paramCfg.type !== 'KQI' && <div style={{ width: '20%', paddingLeft: 5 }}>
                        <Select
                            type="select"
                            placeholder={ls('POLICY_CONJUNCTION_OPERATOR_PLACEHOLDER', 'Оператор')}
                            value={_.get(value, 'operator')}
                            options={this.mapOperators(parameters, parameter)}
                            onChange={(value) => this.setConjunctionProperty('operator', value)}
                            valid={errors && _.isEmpty(_.get(errors, 'operator', null))}
                        />
                    </div>}
                    <div style={{ width: '20%', paddingLeft: 5 }}>
                        {this.renderValueControl(paramCfg, value, errors)}
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
