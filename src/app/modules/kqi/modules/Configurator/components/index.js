import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';

import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from "../../../../../components/Field";
import Formula from './Formula';
import styles from './styles.scss';
import { OBJECT_TYPES, OPERATOR_TYPES, } from '../constants';

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
        errors: PropTypes.object,
    };

    static defaultProps = {
        active: false,
        paramTypes: [],
        paramTypesById: null,
        onMount: () => null,
        errors: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            config: {
                name: '',
                ['kpi-object_type']: '',
                kpi_parameter_type: null,
                operator: '',
                level: '',
            },
            errors: null,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.errors !== nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    static mapObjectToOptions(object) {
        return _.map(object, (title, value) => ({ value, title }));
    }

    setConfigProperty = (key, value) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };
        this.setState({
            config,
            errors: _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors,
        });
    };

    onChangeParameterType = (value) => {

        this.setConfigProperty('kpi_parameter_type', value);
    };

    onClose = () => {
        this.context.history.push('/kqi');
    };

    onSubmit = () => {
        this.props.onSubmit(this.state.config);
    };

    mapConfig = (config) => {
        const conf = { ...config };
        if (config.kpi_parameter_type) {
            conf.kpi_parameter_type = _.get(this.props.paramTypesById, `${config.kpi_parameter_type}.name`, '');
        }
        if (config.operator) {
            conf.operator = OPERATOR_TYPES[config.operator];
        }
        return conf;
    };

    render() {
        const { config, errors } = this.state;
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
                            required
                        >
                            <Input
                                id="name"
                                value={config.name}
                                onChange={event => this.setConfigProperty('name', event.currentTarget.value)}
                                valid={errors && _.isEmpty(errors.name)}
                            />
                        </Field>
                        <Field
                            id="object-type"
                            labelText={ls('KQI_CONFIGURATOR_OBJECT_TYPE_LABEL', 'Тип объекта:')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Select
                                options={Configurator.mapObjectToOptions(OBJECT_TYPES)}
                                onChange={value => this.setConfigProperty('kpi-object_type', value)}
                                valid={errors && _.isEmpty(errors['kpi-object_type'])}
                            />
                        </Field>
                        <Field
                            id="param"
                            labelText={ls('KQI_PARAMETER_LABEL', 'Параметр:')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Select
                                options={this.props.paramTypes.map(type => ({ value: type.id, title: type.name }))}
                                onChange={this.onChangeParameterType}
                                valid={errors && _.isEmpty(errors.kpi_parameter_type)}
                            />
                        </Field>
                        <Field
                            id="operator"
                            labelText={ls('KQI_OPERATOR_LABEL', 'Оператор:')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Select
                                options={Configurator.mapObjectToOptions(OPERATOR_TYPES)}
                                onChange={value => this.setConfigProperty('operator', value)}
                                valid={errors && _.isEmpty(errors.operator)}
                            />
                        </Field>
                        <Field
                            id="level"
                            labelText={ls('KQI_LEVEL_LABEL', 'Значение:')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Input
                                type="number"
                                id="level"
                                value={config.level}
                                onChange={event => this.setConfigProperty('level', event.currentTarget.value)}
                                valid={errors && _.isEmpty(errors.level)}
                            />
                        </Field>
                        <Formula
                            config={this.mapConfig(config)}
                        />

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
