import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';

import Select from '../../../../../components/Select';
import Field from "../../../../../components/Field";
import styles from './styles.scss';
import {
    OBJECT_TYPES,
    OPERATOR_TYPES,
} from '../constants';

class Configurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        paramTypes: PropTypes.array,
        paramTypesById: PropTypes.object,
        onMount: PropTypes.func,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        active: false,
        paramTypes: [],
        paramTypesById: null,
        onMount: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            config: {
                name: '',
                object_type: '',
                parameter_type: null,
                operator_type: '',
                level: '',
            },
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    static mapObjectToOptions (object) {
        return _.map(object, (title, value) => ({ value, title }));
    }

    setConfigProperty = (key, value) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };
        this.setState({ config });
    };

    onChangeParameterType = (value) => {
        const parameterType = _.get(this.props.paramTypesById, `${value}`, null);

        this.setConfigProperty('parameter_type', parameterType);
    }

    onClose = () => {
        this.context.history.push('/kqi');
    }

    onSubmit = () => {
        this.props.onSubmit(this.state.config);
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
                                options={Configurator.mapObjectToOptions(OBJECT_TYPES)}
                                onChange={value => this.setConfigProperty('object_type', value)}
                            />
                        </Field>
                        <Field
                            id="param"
                            labelText={ls('KQI_PARAMETER_LABEL', 'Параметр:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Select
                                options={this.props.paramTypes.map(type => ({ value: type.id, title: type.name }))}
                                onChange={this.onChangeParameterType}
                            />
                        </Field>
                        <Field
                            id="operator"
                            labelText={ls('KQI_OPERATOR_LABEL', 'Оператор:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Select
                                options={Configurator.mapObjectToOptions(OPERATOR_TYPES)}
                                onChange={value => this.setConfigProperty('operator_type', value)}
                            />
                        </Field>
                        <Field
                            id="level"
                            labelText={ls('KQI_LEVEL_LABEL', 'Значение:')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Input
                                type="number"
                                id="level"
                                value={config.value}
                                onChange={event => this.setConfigProperty('level', event.currentTarget.value)}
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
