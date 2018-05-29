import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Icon from "../../../../../components/Icon/Icon";
import Panel from '../../../../../components/Panel';
import ls from 'i18n';

import styles from './styles.scss';
import _ from 'lodash';
import Conjunction from "./Conjunction";
import classnames from "classnames";

class Condition extends React.PureComponent {
    static propTypes = {
        condition: PropTypes.object,
        onChange: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        getPolicyProperty: () => null,
        setPolicyProperty: () => null,
        errors: null,
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
            },
            errors: null,
        }
    }

    componentDidMount() {
        this.props.onChange(this.state);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.condition !== this.props.condition) {
            this.setState({ condition: nextProps.condition.condition });
        }

        if (!_.isEqual(this.props.errors, nextProps.errors)) {
            this.setState({ errors: nextProps.errors });
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

    setConditionProperty = (path, value, cleanError) => {
        const conditionValues = _.set({}, path, value);
        const condition = _.merge(
            {},
            this.state.condition,
            conditionValues,
        );
        this.setState({
            condition,
            errors: cleanError ? _.omit(this.state.errors, path) : this.state.errors,
        });
        this.props.onChange({ condition });
    };

    addConjunction = () => {
        const list = this.getConditionProperty('conjunction.conjunctionList', []);
        const conjunctionList = [...list, {
            value: ''
        }];
        this.setConditionProperty('conjunction.conjunctionList', conjunctionList, false)
    };

    mapObjectTypes = objectTypes => objectTypes.map(type => ({ title: type, value: type }));

    removeConjunction = index => {
        const conjList = this.getConditionProperty('conjunction.conjunctionList', []);
        conjList.splice(index, 1);
        this.setConditionProperty('conjunction.conjunctionList', conjList, false);
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
            onChange={conjunction => this.setConditionProperty(`conjunction.conjunctionList.${index}`, conjunction, false)}
            onRemove={() => this.removeConjunction(index)}
            errors={_.get(this.props.errors, `conjunction.conjunctionList.${index}.value`, null)}
        />)
    };

    getConjunctionListError = (errors) => {
        const conjunctionError = _.get(errors, `conjunction.conjunctionList`);
        if (!_.isArray(conjunctionError) && _.isObject(conjunctionError)) {
            return conjunctionError;
        }
    };

    render() {
        const { errors } = this.state;
        const conjError = this.getConjunctionListError(errors);
        const conjList = this.getConditionProperty('conjunction.conjunctionList');
        const showListError = _.isEmpty(conjList) && !_.isEmpty(conjError);
        return (
            <Panel
                title={ls('POLICIES_CONDITION_TITLE', 'Условие')}
            >
                <Field
                    id="operator"
                    required
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OPERATOR', 'Оператор')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    <Select
                        id="operator"
                        required
                        type="select"
                        value={this.getConditionProperty('conjunction.type', 'AND')}
                        options={this.getOperators()}
                        onChange={value => this.setConditionProperty('conjunction.type', value, true)}
                        valid={errors && _.isEmpty(_.get(errors, 'conjunction.type', null))}
                    />
                </Field>
                <Field
                    id="maxInterval"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_MAX_INTERVAL', 'Максимальный интервал')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                    required
                >
                    <Input
                        id="maxInterval"
                        name="maxInterval"
                        type="number"
                        value={this.getConditionProperty('conditionDuration')}
                        onChange={event => this.setConditionProperty('conditionDuration', _.get(event, 'target.value', ''), true)}
                        valid={errors && _.isEmpty(errors.conditionDuration)}
                    />
                </Field>
                <Field
                    id="object"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OBJECT_TYPE', 'Тип объекта')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                    required
                >
                    <Select
                        id="object"
                        type="select"
                        value={this.getConditionProperty('objectType', 'STB')}
                        options={this.mapObjectTypes(['STB', 'TEST'])}
                        onChange={value => this.setConditionProperty('objectType', value, true)}
                        valid={errors && _.isEmpty(errors.objectType)}
                    />
                </Field>
                <div className={styles.conditionsWrapper}>
                    <Icon icon="addIcon" onClick={this.addConjunction}/>
                    <div className={classnames(styles.conditions, { [styles.invalidBorder]: showListError})}>
                        {showListError ? conjError.title : this.renderConjunctions(conjList)}
                    </div>
                </div>
            </Panel>
        );
    }
}

export default Condition;
