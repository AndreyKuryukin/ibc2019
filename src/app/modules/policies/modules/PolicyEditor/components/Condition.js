import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col  } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import ls from 'i18n';

import styles from './styles.scss';

class Condition extends React.PureComponent {
    render() {
        return (
            <div className={styles.panel}>
                <h6 className={styles.panelHeader}>{ls('POLICIES_CONDITION_TITLE', 'Условие')}</h6>
                <div className={styles.panelBody}>
                    <Field
                        id="operator"
                        labelText={ls('POLICIES_OPERATOR_TITLE', 'Оператор:')}
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
                        labelText={ls('POLICIES_MAX_INTERVAL', 'Максимальный интервал:')}
                    >
                        <Input
                            id="maxInterval"
                            name="maxInterval"
                            value={''}
                            onChange={() => {}}
                        />
                    </Field>
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
                                <Field
                                    id="object"
                                    labelText={ls('POLICIES_OBJECT_TYPE', 'Тип объекта')}
                                >
                                    <Select
                                        id="object"
                                        type="select"
                                        options={[]}
                                        onChange={() => {}}
                                    />
                                </Field>
                                <Row>
                                    <Col sm={6}>
                                        <Field
                                            id="parameter"
                                            labelText={ls('POLICIES_PARAMETER', 'Параметр:')}
                                        >
                                            <Select
                                                id="parameter"
                                                type="select"
                                                options={[]}
                                                onChange={() => {}}
                                            />
                                        </Field>
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
            </div>
        );
    }
}

export default Condition;
