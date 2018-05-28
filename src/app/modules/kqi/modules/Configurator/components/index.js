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
import { OPERATOR_TYPES, } from '../constants';
import DraggableWrapper from '../../../../../components/DraggableWrapper';

class Configurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        objectTypes: PropTypes.array,
        onMount: PropTypes.func,
        onSubmit: PropTypes.func.isRequired,
        errors: PropTypes.object,
    };

    static defaultProps = {
        active: false,
        objectTypes: [],
        onMount: () => null,
        errors: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            paramTypes: [],
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

    setConfigProperty = (key, value, callback) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };
        this.setState({
            config,
            errors: _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors,
        }, callback);
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

    onObjectTypeChange = (type) => {
        if (type) {
            const object_type = _.find(this.props.objectTypes, { type }) || {};
            this.setState({ paramTypes: object_type.parameters || [] }, () => {
                this.setConfigProperty('object_type', object_type.type);
            });
        } else {
            this.setConfigProperty('parameter_type', value, () => {
                this.setConfigProperty('object_type', type);
            });
        }
    };

    mapConfig = (config) => {
        const conf = { ...config };
        if (config.parameter_type) {
            const paramType = this.state.paramTypes.find(param => param.id === config.parameter_type);
            conf.parameter_type = _.get(paramType, 'name', '');
        }
        if (config.operator_type) {
            conf.operator_type = OPERATOR_TYPES[config.operator_type];
        }
        return conf;
    };

    render() {
        const disableForm = !!this.props.config;
        const { config, errors } = this.state;
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.kqiConfigurator}
                >
                    <ModalHeader
                        className="handle"
                        toggle={this.onClose}>{ls('KQI_CONFIGURATOR_TITLE', 'Конфигурация KQI')}</ModalHeader>
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
                                    placeholder={ls('KQI_CONFIGURATOR_NAME_PLACEHOLDER', 'Название')}
                                    maxLength={255}
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
                                    id="object-type"
                                    options={this.props.objectTypes.map(obj => ({ title: obj.type, value: obj.type }))}
                                    disabled={disableForm}
                                    value={_.get(config, 'object_type')}
                                    onChange={value => this.onObjectTypeChange(value)}
                                    valid={errors && _.isEmpty(errors['object_type'])}
                                    placeholder={ls('KQI_CONFIGURATOR_OBJECT_TYPE_PLACEHOLDER', 'Тип объекта')}
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
                                    id="param"
                                    options={this.state.paramTypes.map(type => ({
                                        value: type.id,
                                        title: type.display_name
                                    }))}
                                    onChange={this.onChangeParameterType}
                                    value={_.get(config, 'parameter_type')}
                                    valid={errors && _.isEmpty(errors.parameter_type)}
                                    disabled={disableForm}
                                    placeholder={ls('KQI_CONFIGURATOR_PARAMETER_PLACEHOLDER', 'Параметр')}
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
                                    id="operator"
                                    options={Configurator.mapObjectToOptions(OPERATOR_TYPES)}
                                    onChange={value => this.setConfigProperty('operator_type', value)}
                                    value={_.get(config, 'operator_type')}
                                    valid={errors && _.isEmpty(errors.operator_type)}
                                    disabled={disableForm}
                                    placeholder={ls('KQI_CONFIGURATOR_OPERATOR_PLACEHOLDER', 'Оператор')}
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
                                    placeholder={ls('KQI_CONFIGURATOR_LEVEL_PLACEHOLDER', 'Значение')}
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
            </DraggableWrapper>
        );
    }
}

export default Configurator;
