import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import ls from 'i18n';

import styles from './styles.scss';

class Configuration extends React.PureComponent {
    static propTypes = {
        getPolicyProperty: PropTypes.func,
        setPolicyProperty: PropTypes.func,
    }

    static defaultProps = {
        getPolicyProperty: () => null,
        setPolicyProperty: () => null,
    }

    render() {
        const { getPolicyProperty, setPolicyProperty } = this.props;
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
                        value={getPolicyProperty('name')}
                        onChange={event => setPolicyProperty('name', _.get(event, 'target.value'))}
                    />
                </Field>
                    <Field
                        id="aggregation"
                        labelText="Фукнция агрегации:"
                    >
                        <Select
                            id="aggregation"
                            type="select"
                            options={[]}
                            onChange={() => {}}
                        />
                    </Field>
                    <Row>
                        <Col sm={6}>
                            <Field
                                id="rise_duration"
                                labelText="Интервал агрегации:"
                            >
                                <Input
                                    id="rise_duration"
                                    name="rise_duration"
                                    value={getPolicyProperty('threshold.rise_duration')}
                                    onChange={event => setPolicyProperty('threshold.rise_duration', _.get(event, 'target.value'))}
                                />
                            </Field>
                        </Col>
                        <Col sm={6}>
                            <Field
                                id="rise_value"
                                labelText="Порог:"
                            >
                                <Input
                                    id="rise_value"
                                    name="rise_value"
                                    value={getPolicyProperty('threshold.rise_value')}
                                    onChange={event => setPolicyProperty('threshold.rise_value', _.get(event, 'target.value'))}
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
