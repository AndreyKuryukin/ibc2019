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
                object_type: '',
                parameter_type: null,
                operator_type: '',
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
        if (!_.isEmpty(nextProps.config) && this.state.config !== nextProps.config) {
            this.setState({ config: nextProps.config });
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

        this.setConfigProperty('parameter_type', value);
    };

    onClose = () => {
        this.context.history.push('/kqi');
    };

    onSubmit = () => {
        this.props.onSubmit(this.state.config);
    };

    validateNumKey = (e) => {
        const isKeyAllowed = (e.charCode >= 48 && e.charCode <= 57) || e.charCode === 46 || e.charCode === 45;

        if (!isKeyAllowed) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    onChangeLevel = (e) => {
        const value = e.target.value;
        const isValidValue = e.target.value === '-' || !isNaN(+e.target.value);

        if (value.length <= 21 && isValidValue) {
            this.setConfigProperty('level', value);
        }
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
        const disableForm = !!this.props.config;
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
                            labelText={ls('KQI_CONFIGURATOR_NAME_LABEL', 'Название')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Input
                                id="name"
                                disabled={disableForm}
                                value={config.name}
                                onChange={event => this.setConfigProperty('name', event.currentTarget.value)}
                                valid={errors && _.isEmpty(errors.name)}
                            />
                        </Field>
                        <Field
                            id="object-type"
                            labelText={ls('KQI_CONFIGURATOR_OBJECT_TYPE_LABEL', 'Тип объекта')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Select
                                options={Configurator.mapObjectToOptions(OBJECT_TYPES)}
                                disabled={disableForm}
                                value={_.get(config, 'kpi-object_type')}
                                onChange={value => this.setConfigProperty('object_type', value)}
                                valid={errors && _.isEmpty(errors['object_type'])}
                            />
                        </Field>
                        <Field
                            id="param"
                            labelText={ls('KQI_PARAMETER_LABEL', 'Параметр')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Select
                                options={this.props.paramTypes.map(type => ({ value: type.id, title: type.name }))}
                                onChange={this.onChangeParameterType}
                                value={_.get(config, 'parameter_type')}
                                valid={errors && _.isEmpty(errors.parameter_type)}
                                disabled={disableForm}
                            />
                        </Field>
                        <Field
                            id="operator"
                            labelText={ls('KQI_OPERATOR_LABEL', 'Оператор')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Select
                                options={Configurator.mapObjectToOptions(OPERATOR_TYPES)}
                                onChange={value => this.setConfigProperty('operator_type', value)}
                                value={_.get(config, 'operator_type')}
                                valid={errors && _.isEmpty(errors.operator)}
                                disabled={disableForm}
                            />
                        </Field>
                        <Field
                            id="level"
                            labelText={ls('KQI_LEVEL_LABEL', 'Значение')}
                            labelWidth="35%"
                            inputWidth="65%"
                            required
                        >
                            <Input
                                id="level"
                                value={config.level}
                                onChange={this.onChangeLevel}
                                valid={errors && _.isEmpty(errors.level)}
                                disabled={disableForm}
                                onKeyPress={this.validateNumKey}
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
                    {
                        !disableForm && <Button color="action" onClick={this.onSubmit}>
                            {ls('OK', 'OK')}
                        </Button>
                    }
                </ModalFooter>
            </Modal>
        );
    }
}

export default Configurator;
