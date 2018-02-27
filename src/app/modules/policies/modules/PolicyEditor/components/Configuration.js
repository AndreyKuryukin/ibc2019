import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import ls from 'i18n';

import styles from './styles.scss';

class Configuration extends React.PureComponent {
    render() {
        return (
            <div className={styles.panel}>
                <h6>{ls('POLICIES_CONFIGURATION_TITLE', 'Конфигурация')}</h6>
                <Input
                    name="name"
                    value={''}
                    placeholder={ls('NAME_FIELD', 'Имя')}
                    onChange={() => {}}
                />
                <Select
                    type="select"
                    placeholder={ls('POLICY_EDITOR_AGREGATION_FUNCTION_FIELD', 'Функция агрегации')}
                    options={[]}
                    onChange={() => {}}
                />
                <Row>
                    <Col sm={6}>
                        <Input
                            name="interval"
                            value={''}
                            placeholder={ls('POLICY_EDITOR_AGREGATION_INTERVAL_FIELD', 'Интервал агрегации')}
                            onChange={() => {}}
                        />
                    </Col>
                    <Col sm={6}>
                        <Input
                            name="threshold"
                            value={''}
                            placeholder={ls('POLICY_EDITOR_THRESHOLD_FIELD', 'Порог')}
                            onChange={() => {}}
                        />
                    </Col>
                </Row>
                <Input
                    type="textarea"
                    value={''}
                    placeholder={ls('POLICY_EDITOR_MESSAGE_TEXT_FIELD', 'Текст сообщения')}
                    onChange={() => {}}
                />
            </div>
        )
    }
}

export default Configuration;
