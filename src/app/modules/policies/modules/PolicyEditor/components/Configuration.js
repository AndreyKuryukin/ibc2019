import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';
import Input from '../../../../../components/Input';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import ls from 'i18n';

import styles from './styles.scss';

class Configuration extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        policy: PropTypes.object
    };

    static defaultProps = {
        onChange: () => null,
        policy: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            policy: props.policy || {},
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({policy: nextProps.policy});
    }

    setPolicyProperty = (path, value) => {
        const policy = _.set(this.state.policy, path, value);
        this.setState({policy});
        this.props.onChange(policy);
    };

    render() {
        const policy = this.state.policy;
        console.log(policy);

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
                            value={_.get(policy, 'name')}
                            onChange={(e) => this.setPolicyProperty('name', e.currentTarget.value)}
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
                            onChange={() => {
                            }}
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
                                    value={_.get(policy, 'threshold.rise_duration')}
                                    onChange={(e) => this.setPolicyProperty('threshold.rise_duration', e.currentTarget.value)}
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
                                    value={_.get(policy, 'threshold.rise_value')}
                                    onChange={(e) => this.setPolicyProperty('threshold.rise_value', e.currentTarget.value)}

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
                            onChange={(e) => this.setPolicyProperty('notification_template', e.currentTarget.value)}

                        />
                    </Field>
                </div>
            </div>
        )
    }
}

export default Configuration;
