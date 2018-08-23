import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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

const unitStyle = { margin: '3px 0px 3px 2px' };

class Condition extends React.PureComponent {
    static propTypes = {
        condition: PropTypes.object,
        onChange: PropTypes.func,
        errors: PropTypes.object,
        metaData: PropTypes.object,
        parameters: PropTypes.array,
    };

    static defaultProps = {
        getPolicyProperty: () => null,
        setPolicyProperty: () => null,
        errors: null,
        parameters: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            condition: {
                conditionDuration: '',
                conjunction: {
                    type: 'AND',
                    conjunctionList: []
                }
            },
            errors: null,
        }
    }

    componentDidMount() {
        this.props.onChange({ condition: this.state.condition });
    }

    componentWillReceiveProps(nextProps) {
        if (_.isObject(_.get(nextProps, 'condition.condition')) ) {
            this.setState({ condition: {...nextProps.condition.condition }});
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
        }, () => {
            this.props.onChange({ condition }, cleanError ? path : '');
        });
    };

    addConjunction = () => {
        const list = this.getConditionProperty('conjunction.conjunctionList', []);
        const conjunctionList = [...list, {
            value: ''
        }];
        this.setConditionProperty('conjunction.conjunctionList', conjunctionList, false)
    };

    removeConjunction = index => {
        const conjList = this.getConditionProperty('conjunction.conjunctionList', []);
        conjList.splice(index, 1);
        this.setConditionProperty('conjunction.conjunctionList', conjList, false);
    };

    renderConjunctions = (conjunctionList = [], parameters) => {
        return conjunctionList.map((conj, index) => <Conjunction
            key={`conjunction-${index}`}
            conjunction={conj}
            parameters={parameters}
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

    getSeconds = (mills) => {
        return moment.duration(mills, 'milliseconds').asSeconds() || '';
    };

    getMilliSeconds = (secs) => {
        return moment.duration(Number(secs), 'seconds').asMilliseconds() || '';
    };

    render() {
        const { errors } = this.state;
        const { parameters, metaData } = this.props;
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
                        itemId="policies_operator"
                        id="operator"
                        required
                        type="select"
                        placeholder={ls('POLICY_OPERATOR_PLACEHOLDER', 'Оператор')}
                        value={this.getConditionProperty('conjunction.type', 'AND')}
                        options={this.getOperators()}
                        onChange={value => this.setConditionProperty('conjunction.type', value, true)}
                        valid={errors && _.isEmpty(_.get(errors, 'conjunction.type', null))}
                    />
                </Field>
                {_.get(metaData, 'conditionDuration', false) && <Field
                    id="maxInterval"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_MAX_INTERVAL', 'Максимальный интервал')}`}
                    labelWidth="50%"
                    inputWidth="50%"
                    required
                    className={styles.fieldWithUnit}
                >
                    <Input
                        itemId="policies_max_interval"
                        id="maxInterval"
                        type="number"
                        name="maxInterval"
                        placeholder="0"
                        value={this.getSeconds(this.getConditionProperty('conditionDuration'))}
                        onChange={value => this.setConditionProperty('conditionDuration', this.getMilliSeconds(value), true)}
                        valid={errors && _.isEmpty(errors.conditionDuration)}
                        maxLength={6}
                    />
                    <span style={unitStyle}>{ls('SECOND_UNIT', 'сек.')}</span>
                </Field>}
                <div className={styles.conditionsWrapper}>
                    <Icon
                        itemId="policies_add_condition"
                        icon="addIcon"
                        onClick={this.addConjunction}
                        title={ls('ADD_POLICY_CONDITION_TITLE', 'Добавить условие')}
                    />
                    <div className={classnames(styles.conditions, { [styles.invalidBorder]: showListError })}>
                        {showListError ? conjError.title : this.renderConjunctions(conjList, parameters)}
                    </div>
                </div>
            </Panel>
        );
    }
}

export default Condition;
