import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import ls from 'i18n';

import styles from './styles.scss';

class Configuration extends React.PureComponent {
    render() {
        return (
            <div className={styles.panel}>
                <h6 className={styles.panelHeader}>{ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}</h6>
                <div className={styles.panelBody}>
                    <Field
                    id="name"
                    labelText="Имя:"
                >
                    <Input
                        id="name"
                        name="name"
                        value={''}
                        onChange={() => {}}
                    />
                </Field>
                    <Field
                        id="agregation"
                        labelText="Фукнция агрегации:"
                        required
                    >
                        <Select
                            id="agregation"
                            type="select"
                            options={[]}
                            onChange={() => {}}
                        />
                    </Field>
                    <Row>
                        <Col sm={6}>
                            <Field
                                id="interval"
                                labelText="Интервал агрегации:"
                            >
                                <Input
                                    id="interval"
                                    name="interval"
                                    value={''}
                                    onChange={() => {}}
                                />
                            </Field>
                        </Col>
                        <Col sm={6}>
                            <Field
                                id="threshold"
                                labelText="Порог:"
                            >
                                <Input
                                    id="threshold"
                                    name="threshold"
                                    value={''}
                                    onChange={() => {}}
                                />
                            </Field>
                        </Col>
                    </Row>
                    <Field
                        id="message"
                        labelText="Текст сообщения:"
                        labelWidth="100%"
                        inputWidth="100%"
                        labelAlign="right"
                    >
                        <Input
                            id="message"
                            type="textarea"
                            value={''}
                            onChange={() => {}}
                        />
                    </Field>
                </div>
            </div>
        )
    }
}

export default Configuration;
