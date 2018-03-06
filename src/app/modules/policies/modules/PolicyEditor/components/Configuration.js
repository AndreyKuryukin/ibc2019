import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import Panel from '../../../../../components/Panel';
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
            <Panel
                title={ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}
            >
                <Field
                    id="name"
                    labelText={`${ls('POLICIES_POLICY_FIELD_NAME', 'Имя')}:`}
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
                    labelText={`${ls('POLICIES_POLICY_FIELD_AGGREGATION', 'Фукнция агрегации')}:`}
                >
                    <Select
                        id="aggregation"
                        type="select"
                        options={[]}
                        onChange={() => {}}
                    />
                </Field>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <div style={{ width: '75%' }}>
                        <Field
                            id="rise_duration"
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_DURATION', 'Интервал агрегации')}:`}
                            labelWidth="67%"
                            inputWidth="17%"
                        >
                            <Input
                                id="rise_duration"
                                name="rise_duration"
                                value={getPolicyProperty('threshold.rise_duration')}
                                onChange={event => setPolicyProperty('threshold.rise_duration', _.get(event, 'target.value'))}
                            />
                        </Field>
                    </div>
                    <div style={{ width: '25%' }}>
                        <Field
                            id="rise_value"
                            labelText={`${ls('POLICIES_POLICY_FIELD_RISE_VALUE', 'Порог')}:`}
                        >
                            <Input
                                id="rise_value"
                                name="rise_value"
                                value={getPolicyProperty('threshold.rise_value')}
                                onChange={event => setPolicyProperty('threshold.rise_value', _.get(event, 'target.value'))}
                            />
                        </Field>
                    </div>
                </div>
                <Field
                    id="message"
                    labelText={`${ls('POLICIES_POLICY_FIELD_MESSAGE', 'Текст сообщения')}:`}
                    labelWidth="100%"
                    inputWidth="100%"
                    labelAlign="right"
                    style={{ marginTop: 10 }}
                >
                    <Input
                        id="message"
                        type="textarea"
                        value={''}
                        onChange={() => {}}
                    />
                </Field>
            </Panel>
        )
    }
}

export default Configuration;
