import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col  } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import ls from 'i18n';

import styles from './styles.scss';

class Condition extends React.PureComponent {
    render() {
        return (
            <div className={styles.panel}>
                <h6>{ls('POLICIES_CONDITION_TITLE', 'Условие')}</h6>
                <Select
                    type="select"
                    placeholder={ls('POLICY_OPERATOR_FIELD', 'Оператор')}
                    options={[]}
                    onChange={() => {}}
                />
                <Input
                    name="maxInterval"
                    value={''}
                    placeholder={ls('POLICY_MAX_INTERVAL_FIELD', 'Максимальный интервал')}
                    onChange={() => {}}
                />
                <div>
                    <Button
                        color="primary"
                        onClick={this.onAdd}
                    >
                        {ls('POLICIES_ADD_TITLE', 'Добавить')}
                    </Button>
                </div>
                <div className={styles.conditions}>
                    <div className={styles.conditionBlock}>
                        <div className={styles.parameters}>
                            <Select
                                type="select"
                                placeholder={ls('POLICY_OBJECT_TYPE_FIELD', 'Тип объекта')}
                                options={[]}
                                onChange={() => {}}
                            />
                            <Row>
                                <Col sm={6}>
                                    <Select
                                        type="select"
                                        placeholder={ls('POLICY_OBJECT_TYPE_FIELD', 'Параметр')}
                                        options={[]}
                                        onChange={() => {}}
                                    />
                                </Col>
                                <Col sm={3}>
                                    <Select
                                        type="select"
                                        placeholder={''}
                                        options={[]}
                                        onChange={() => {}}
                                    />
                                </Col>
                                <Col sm={3}>
                                    <Input
                                        name="threshold"
                                        value={''}
                                        placeholder={''}
                                        onChange={() => {}}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <span className={styles.remove}>×</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Condition;
