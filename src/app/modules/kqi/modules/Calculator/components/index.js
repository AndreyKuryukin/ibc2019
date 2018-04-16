import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import { createSelector } from 'reselect';
import styles from './styles.scss';
import {
    DATE_TIME_GROUPING,
    GROUPING_TYPES,
    LAST_INCH_TECHNOLOGIES,
    LAST_MILE_TECHNOLOGIES,
    LOCATION_GROUPING,
    SERVICE_TYPES,
} from '../constants';
import Period from './Period';
import BasicParams from './BasicParams';
import Location from './Location';
import Technology from './Technology';
import Manufacture from './Manufacture';
import Equipment from './Equipment';
import UserGroups from './UserGroups';

class Calculator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        kqiList: PropTypes.array,
        locationsList: PropTypes.array,
        manufactureList: PropTypes.array,
        equipmentsList: PropTypes.array,
        usergroupsList: PropTypes.array,
        onSubmit: PropTypes.func.isRequired,
        onMount: PropTypes.func,
        errors: PropTypes.object,
    };

    static defaultProps = {
        active: false,
        kqiList: [],
        locationsList: [],
        manufactureList: [],
        equipmentsList: [],
        usergroupsList: [],
        onSubmit: () => null,
        onMount: () => null,
        errors: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            config: {
                name: '',
                service_type: '',
                period: '',
                start_date_time: null,
                end_date_time: null,
                location: '',
                last_mile_technology: '',
                last_inch_technology: '',
                manufacturer: '',
                equipment_type: '',
                abonent_group: '',
                kqi_id: null,
                auto_gen: true,
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

    static mapListToOptions = createSelector(
        (props, listName) => _.get(props, `${listName}`, []),
        list => list.map((item) => {
            if (typeof item === 'string') return { value: item, title: item };
            if (typeof item === 'object') return { value: item.id, title: item.name };
        }),
    );

    setConfigProperty = (key, value) => {
        const config = {
            ...this.state.config,
            [key]: value,
        };

        if (key === 'manufacturer') {
            config['manufacturer_grouping'] = value.length > 1;
        }

        this.setState({
            config,
            errors: _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors,
        });
    };

    onClose = () => {
        this.context.history.push('/kqi');
    };

    onIntervalChange = (start, end, period, groupingType) => {
        const removeKeys = [
            ...(start ? ['start_date_time'] : []),
            ...(end ? ['end_date_time'] : []),
        ];

        this.setState({
            config: {
                ...this.state.config,
                start_date_time: start,
                end_date_time: end,
                period,
                date_time_grouping: groupingType,
            },
            errors: _.omit(this.state.errors, removeKeys),
        });
    };

    onSubmit = () => {
        const { config } = this.state;
        const preparedConfig = {
            ...config,
            date_time_grouping: _.get(config, 'date_time_grouping') ? [_.get(config, 'date_time_grouping')] : [GROUPING_TYPES.NONE],
            location_grouping: _.get(config, 'location_grouping') ? [_.get(config, 'location_grouping')] : [GROUPING_TYPES.NONE],
            last_mile_technology_grouping: _.get(config, 'last_mile_technology_grouping') ? [GROUPING_TYPES.SELF] : [GROUPING_TYPES.NONE],
            last_inch_technology_grouping: _.get(config, 'last_inch_technology_grouping', false) ? [GROUPING_TYPES.SELF] : [GROUPING_TYPES.NONE],
            manufacturer_grouping: _.get(config, 'manufacturer_grouping', false) ? [GROUPING_TYPES.SELF] : [GROUPING_TYPES.NONE],
            equipment_type_grouping: _.get(config, 'equipment_type_grouping') ? [_.get(config, 'equipment_type_grouping')] : [GROUPING_TYPES.NONE],
            abonent_group_grouping: _.get(config, 'abonent_group_grouping') ? [_.get(config, 'abonent_group_grouping')] : [GROUPING_TYPES.NONE],
        };

        this.props.onSubmit(preparedConfig);
    };

    render() {
        return (
            <Modal
                isOpen={this.props.active}
                className={styles.kqiCalculator}
            >
                <ModalHeader
                    toggle={this.onClose}
                >
                    {ls('KQI_CALCULATOR_TITLE', 'Вычисление KQI')}
                </ModalHeader>
                <ModalBody>
                    <div className={styles.kqiCalculatorContent}>
                        <BasicParams
                            name={_.get(this.state.config, 'name')}
                            onNameChange={value => this.setConfigProperty('name', value)}
                            serviceTypesOptions={Calculator.mapObjectToOptions(SERVICE_TYPES)}
                            kqiOptions={Calculator.mapListToOptions(this.props, 'kqiList')}
                            onServiceTypeChange={value => this.setConfigProperty('service_type', value)}
                            onKQIChange={value => this.setConfigProperty('kqi_id', value)}
                            errors={this.state.errors}
                        />
                        <Period
                            onIntervalChange={this.onIntervalChange}
                            groupingOptions={Calculator.mapObjectToOptions(DATE_TIME_GROUPING)}
                            onGroupingTypeChange={value => this.setConfigProperty('date_time_grouping', value)}
                            errors={this.state.errors}
                            isAutoGen={_.get(this.state.config, 'auto_gen', false)}
                            onAutoGenChange={value => this.setConfigProperty('auto_gen', value)}
                        />
                        <Location
                            locationOptions={Calculator.mapListToOptions(this.props, 'locationsList')}
                            groupingOptions={Calculator.mapObjectToOptions(LOCATION_GROUPING)}
                            onLocationChange={value => this.setConfigProperty('location', value)}
                            onGroupingTypeChange={value => this.setConfigProperty('location_grouping', value)}
                        />
                        <Technology
                             id="last-mile-technology"
                             title={ls('KQI_CALCULATOR_LAST_MILE_TECHNOLOGY_TITLE', 'Тип технологии последней мили')}
                             label={`${ls('KQI_CALCULATOR_LAST_MILE_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПМ')}:`}
                             technologies={Calculator.mapObjectToOptions(LAST_MILE_TECHNOLOGIES)}
                             onTechnologyChange={value => this.setConfigProperty('last_mile_technology', value)}
                             onGroupingChange={value => this.setConfigProperty('last_mile_technology_grouping', value)}
                         />
                        <Technology
                            id="last-inch-technology"
                            title={ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_TITLE', 'Тип технологии последнего дюйма')}
                            label={`${ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПД')}:`}
                            technologies={Calculator.mapObjectToOptions(LAST_INCH_TECHNOLOGIES)}
                            onTechnologyChange={value => this.setConfigProperty('last_inch_technology', value)}
                            onGroupingChange={value => this.setConfigProperty('last_inch_technology_grouping', value)}
                        />
                        <div className={styles.bottomContent}>
                            <Manufacture
                                isGroupingChecked={_.get(this.state.config, 'manufacturer_grouping', false)}
                                manufactureList={[{ id: 'Vendor_1', name: 'Vendor 1' }, { id: 'Vendor_2', name: 'Vendor 2' }]}
                                onCheckManufactures={value => this.setConfigProperty('manufacturer', value)}
                                onGroupingChange={value => this.setConfigProperty('manufacturer_grouping', value)}
                            />
                            <div className={styles.panels}>
                                <Equipment
                                    equipmentsList={Calculator.mapListToOptions(this.props, 'equipmentsList')}
                                    onEquipmentTypeChange={value => this.setConfigProperty('equipment_type', value)}
                                    onGroupingChange={value => this.setConfigProperty('equipment_type_grouping', value)}
                                />
                                <UserGroups
                                    usergroupsList={Calculator.mapListToOptions(this.props, 'usergroupsList')}
                                    onUsergroupChange={value => this.setConfigProperty('abonent_group', value)}
                                    onGroupingChange={value => this.setConfigProperty('abonent_group_grouping', value)}
                                />
                            </div>
                        </div>
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

export default Calculator;
