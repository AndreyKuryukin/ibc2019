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
            value: PropTypes.string
        }),
        parameterList: PropTypes.array,
        operatorList: PropTypes.array,
        onChange: PropTypes.func,
        onRemove: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        conjunction: {
            value: {}
        },
        parameterList: [],
        operatorList: [],
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

            this.setState(conjunction)
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

    mapParameters = parameters => parameters.map(param => ({ title: param, value: param }));

    mapOperators = operators => operators.map(operator => ({ title: operator, value: operator }));

    render() {
        const { value, errors } = this.state;
        const { parameterList, operatorList } = this.props;
        return <div className={styles.conditionBlock}>
            <div className={styles.parameters}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ width: '60%' }}>
                        <Field
                            id="parameter"
                            labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Параметр')}:`}
                            labelWidth="50%"
                            inputWidth="50%"
                        >
                            <Select
                                id="parameter"
                                type="select"
                                value={_.get(value, 'parameterType')}
                                options={this.mapParameters(parameterList)}
                                onChange={(value) => this.setConjunctionProperty('parameterType', value)}
                                valid={errors && _.isEmpty(_.get(errors, 'parameterType', null))}
                            />
                        </Field>
                    </div>
                    <div style={{ width: '20%', paddingLeft: 5 }}>
                        <Select
                            type="select"
                            placeholder={''}
                            value={_.get(value, 'operator')}
                            options={this.mapOperators(operatorList)}
                            onChange={(value) => this.setConjunctionProperty('operator', value)}
                            valid={errors && _.isEmpty(_.get(errors, 'operator', null))}
                        />
                    </div>
                    <div style={{ width: '20%', paddingLeft: 5 }}>
                        <Input
                            name="value"
                            value={_.get(value, 'value')}
                            type="number"
                            onChange={(event) => this.setConjunctionProperty('value', _.get(event, 'currentTarget.value'))}
                            valid={errors && _.isEmpty(_.get(errors, 'value', null))}
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
