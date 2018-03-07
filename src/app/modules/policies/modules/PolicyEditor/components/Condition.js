import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col  } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Icon from "../../../../../components/Icon/Icon";
import Panel from '../../../../../components/Panel';
import ls from 'i18n';

import styles from './styles.scss';

class Condition extends React.PureComponent {
    render() {
        return (
            <Panel
                title={ls('POLICIES_CONDITION_TITLE', 'Условие')}
            >
                <Field
                    id="operator"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_OPERATOR', 'Оператор')}:`}
                >
                    <Select
                        id="operator"
                        type="select"
                        options={[]}
                        onChange={() => {}}
                    />
                </Field>
                <Field
                    id="maxInterval"
                    labelText={`${ls('POLICIES_CONDITION_FIELD_MAX_INTERVAL', 'Максимальный интервал')}:`}
                >
                    <Input
                        id="maxInterval"
                        name="maxInterval"
                        value={''}
                        onChange={() => {}}
                    />
                </Field>
                <div className={styles.conditionsWrapper}>
                    <Icon icon="addIcon" onClick={this.onAdd}/>
                    <div className={styles.conditions}>
                        <div className={styles.conditionBlock}>
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
                                        options={[]}
                                        onChange={() => {}}
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
                                                options={[]}
                                                onChange={() => {}}
                                            />
                                        </Field>
                                    </div>
                                    <div style={{ width: '20%', paddingLeft: 5 }}>
                                        <Select
                                            type="select"
                                            placeholder={''}
                                            options={[]}
                                            onChange={() => {}}
                                        />
                                    </div>
                                    <div style={{ width: '20%', paddingLeft: 5 }}>
                                        <Input
                                            name="threshold"
                                            value={''}
                                            placeholder={''}
                                            onChange={() => {}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <span className={styles.remove}>×</span>
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
}

export default Condition;
