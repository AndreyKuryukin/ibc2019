import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Icon from "../../../../../components/Icon/Icon";
import Panel from '../../../../../components/Panel';
import ls from 'i18n';

import styles from './styles.scss';
import * as _ from "lodash";
import Conjunction from "./Conjunction";

class Condition extends React.PureComponent {
    static propTypes = {
        condition: PropTypes.object,
        onChange: PropTypes.func
    };

    static defaultProps = {
        getPolicyProperty: () => null,
        setPolicyProperty: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            condition: {
                conditionDuration: 0,
                conjunction: {
                    type: 'AND',
                    conjunctionList: []
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.condition !== this.props.condition) {
            this.setState(nextProps.condition)
        }
    }

    getOperators = () => {
        return [{
            title: ls('AND', 'И'),
            value: "AND"
        }, {
            title: ls('OR', 'ИЛИ'),
            value: "OR"
        }]
    };

    getConditionProperty = (path, defaultValue) => _.get(this.state.condition, path, defaultValue);

    setConditionProperty = (path, value) => {
        const conditionValues = _.set({}, path, value);
        const condition = _.merge(
            {},
            this.state.condition,
            conditionValues,
        );
        const state = {...this.state, condition};
        this.setState(state);
        this.props.onChange(state);
    };

    addConjunction = () => {
        const list = this.getConditionProperty('conjunction.conjunctionList', []);
        const conjunctionList = [...list, {
            value: ''
        }];
        this.setConditionProperty('conjunction.conjunctionList', conjunctionList)
    };

    mapObjectTypes = objectTypes => objectTypes.map(type => ({ title: type, value: type }));

    removeConjunction = index => {
        const conjList = this.getConditionProperty('conjunction.conjunctionList', []);
        conjList.splice(index, 1);
        this.setConditionProperty('conjunction.conjunctionList', conjList);
    };

    renderConjunctions = (conjunctionList = []) => {
        return conjunctionList.map((conj, index) => <Conjunction
            key={`conjunction-${index}`}
            conjunction={conj}
            parameterList={['received',
                'linkFaults',
                'lostOverflow',
                'lost']}
            operatorList={['>', '<', '=']}
            onChange={conjunction => this.setConditionProperty(`conjunction.conjunctionList.${index}`, conjunction)}
            onRemove={() => this.removeConjunction(index)}
        />)
    };

    render() {
        return (
            <Panel
                title={ls('POLICIES_CONDITION_TITLE', 'Условие')}
            >
                <Field
                    id="operator"
                    required
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OPERATOR', 'Оператор')}:`}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    <Select
                        id="operator"
                        required
                        defaultValue="AND"
                        type="select"
                        value={this.getConditionProperty('conjunction.type')}
                        options={this.getOperators()}
                        onChange={value => this.setConditionProperty('conjunction.type', value)}
                    />
                </Field>
                <Field
                    id="maxInterval"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_MAX_INTERVAL', 'Максимальный интервал')}:`}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    <Input
                        id="maxInterval"
                        name="maxInterval"
                        type="number"
                        value={this.getConditionProperty('conjunction.conditionDuration')}
                        onChange={event => this.setConditionProperty('conjunction.conditionDuration', _.get(event, 'target.value', ''))}
                    />
                </Field>
                <Field
                    id="object"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Тип объекта')}:`}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    <Select
                        id="object"
                        type="select"
                        value={this.getConditionProperty('conjunction.objectType', '')}
                        defaultValue="STB"
                        options={this.mapObjectTypes(['STB', 'TEST'])}
                        onChange={value => this.setConditionProperty('conjunction.objectType', value)}
                    />
                </Field>
                <div className={styles.conditionsWrapper}>
                    <Icon icon="addIcon" onClick={this.addConjunction}/>
                    <div className={styles.conditions}>
                        {this.renderConjunctions(this.getConditionProperty('conjunction.conjunctionList'))}
                    </div>
                </div>
            </Panel>
        );
    }
}

export default Condition;
