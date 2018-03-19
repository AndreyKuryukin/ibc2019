import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from "i18n";

import Select from '../../../../../components/Select';
import Field from "../../../../../components/Field";
import styles from './styles.scss';

class Configurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        active: false,
        onSubmit: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            config: {
                name: '',
                objectType: '',
                param: '',
                operator: '',
                value: '',
            },
        };
    }

    setConfigProperty = (key, value) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };
        this.setState({ config });
    };

    onClose = () => {
        this.context.history.push('/kqi');
    }

    onSubmit = () => {
        console.log(this.state.config);
    }

    render() {
        const { config } = this.state;
        return (
            <Modal
                isOpen={this.props.active}
                className={styles.kqiConfigurator}
            >
                <ModalHeader
                    toggle={this.onClose}>{ls('KQI_CONFIGURATOR_TITLE', 'Конфигурация KPI/KQI')}</ModalHeader>
                <ModalBody>
                    <div className={styles.configuratorContent}>
                        <Field
                            id="name"
                            labelText={ls('KQI_CONFIGURATOR_NAME_LABEL', 'Название:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Input
                                id="name"
                                value={config.name}
                                onChange={event => this.setConfigProperty('name', event.currentTarget.value)}
                            />
                        </Field>
                        <Field
                            id="object-type"
                            labelText={ls('KQI_CONFIGURATOR_OBJECT_TYPE_LABEL', 'Тип объекта:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Select
                                options={[{title: '123', value: '123'}]}
                                onChange={value => this.setConfigProperty('objectType', value)}
                            />
                        </Field>
                        <Field
                            id="param"
                            labelText={ls('KQI_PARAMETER_LABEL', 'Параметр:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Input
                                id="param"
                                value={config.param}
                                onChange={event => this.setConfigProperty('param', event.currentTarget.value)}
                            />
                        </Field>
                        <Field
                            id="operator"
                            labelText={ls('KQI_OPERATOR_LABEL', 'Оператор:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Select
                                options={[{title: '123', value: '123'}]}
                                onChange={value => this.setConfigProperty('operator', value)}
                            />
                        </Field>
                        <Field
                            id="value"
                            labelText={ls('KQI_VALUE_LABEL', 'Значение:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Input
                                id="value"
                                value={config.value}
                                onChange={event => this.setConfigProperty('value', event.currentTarget.value)}
                            />
                        </Field>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="action" onClick={this.onClose}>
                        {ls('CANCEL', 'Отмена')}
                    </Button>
                    <Button color="action" onClick={this.onSubmit}>
                        {ls('OK', 'OK')}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Configurator;
