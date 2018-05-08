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
import moment from "moment";

const NAME_PATTERN_SEQUENCE = [
    'period.regularity',
    'location',
    'location_grouping',
    'last_mile_technology',
    'last_mile_technology_grouping',
    'last_inch_technology',
    'last_inch_technology_grouping',
    'manufacturer',
    'manufacturer_grouping',
    'equipment_type',
    'equipment_type_grouping',
    'abonent_group',
    'abonent_group_grouping',
];

const period = {
    HOUR: ls('WEEKLY', 'Ежечасный'),
    DAY: ls('DAY', 'Ежедневный'),
    QUARTER: ls('QUARTER', '15 минутный'),
    OTHER: ls('OTHER', ''),
};

const last_mile_technology_grouping = {
    true: ls('WITH_TECHNOLOGY_GROUPING', 'С группировкой по технологии ПМ'),
};

const last_inch_technology_grouping = {
    true: ls('WITH_TECHNOLOGY_GROUPING', 'С группировкой по технологии ПД'),
};

const manufacturer_grouping = {
    true: ls('WITH_MANUFACTURER_GROUPING', 'С группировкой по производителю оборудования'),
};

const equipment_type_grouping = {
    SELF: ls('WITH_TECHNOLOGY_GROUPING', 'С группировкой по типу оборудования'),
    HW: ls('WITH_HW_GROUPING', 'С группировкой по hw версии'),
    SW: ls('WITH_SW_GROUPING', 'С группировкой по sw версии'),
};

const abonent_group_grouping = {
    SELF: ls('WITH_ABONENT_GROUPS_GROUPING', 'С группировкой по группам абонентов'),
    ABONENT: ls('WITH_ABONENT_GROUPING', 'Формировать список абонентов'),
};

const location_grouping = {
    BRANCH: ls('WITH_BRANCH_GROUPING', 'С группировкой по РФ'),
};


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
        config: PropTypes.object,
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
        const start_date = moment().subtract(1, 'day').startOf('day').toDate();
        const end_date = moment(start_date).endOf('day').toDate();
        this.state = {
            config: {
                name: ls('WEEKLY', 'Ежедневный'),
                service_type: '',
                period: {
                    start_date,
                    end_date,
                    regularity: 'DAY',
                    auto: true,
                },
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

    static mapListToOptions = createSelector(
        (props, listName) => _.get(props, `${listName}`, []),
        list => list.map((item) => {
            if (typeof item === 'string') return { value: item, title: item };
            if (typeof item === 'object') return { value: item.id, title: item.name };
        }),
    );

    composeConfigName = (config) => {
        const ENTITY_NAME_MAP = {
            'period.regularity': period,
            location: this.props.locationsList,
            last_mile_technology: LAST_MILE_TECHNOLOGIES,
            last_inch_technology: LAST_INCH_TECHNOLOGIES,
            service_type: SERVICE_TYPES,
            manufacturer: this.props.manufactureList,
            equipment_type: this.props.equipmentsList,
            abonent_group: this.props.usergroupsList,
            kqi_id: this.props.kqiList,
            location_grouping: location_grouping,
            last_mile_technology_grouping: last_mile_technology_grouping,
            last_inch_technology_grouping: last_inch_technology_grouping,
            manufacturer_grouping: manufacturer_grouping,
            equipment_type_grouping: equipment_type_grouping,
            abonent_group_grouping: abonent_group_grouping,
        };
        const composedName = _.reduce(NAME_PATTERN_SEQUENCE, (name, fieldName) => {
            const value = _.get(config, fieldName);
            const nameMap = ENTITY_NAME_MAP[fieldName];
            const getNameById = (map, id) => {
                let itemName;
                if (_.isArray(map)) {
                    const entity = _.find(map, item => String(item.id) === String(id));
                    itemName = entity && entity.name;
                } else if (_.isObject(map)) {
                    itemName = map[String(id).toUpperCase()];
                    itemName = !!itemName ? itemName : map[String(id).toLowerCase()];
                }
                return itemName ? itemName : id;
            };
            if (value) {
                if (_.isArray(value)) {
                    if (nameMap) {
                        const names = value.map(id => getNameById(nameMap, id));
                        name.push(names.join(','));
                    } else {
                        name.push(value.join(','));
                    }
                } else {
                    if (nameMap) {
                        name.push(getNameById(nameMap, value))
                    } else {
                        name.push(config[fieldName])
                    }
                }
            }
            return name;
        }, []);
        return composedName.join('_')
    };


    setConfigProperty = (key, value) => {
        const config = _.set({
            ...this.state.config,
        }, key, value);

        if (key === 'manufacturer') {
            config['manufacturer_grouping'] = value.length > 1;
        }

        if (key === 'abonent_group' && !!value) {
            config['abonent_group_grouping'] = false;
        }

        if (key === 'last_mile_technology' && !!value) {
            config['last_mile_technology_grouping'] = false;
        }

        if (key === 'last_inch_technology' && !!value) {
            config['last_inch_technology_grouping'] = false;
        }

        if (key === 'equipment_type' && !!value) {
            config['equipment_type_grouping'] = false;
        }

        if (key === 'location' && !value) {
            config['location_grouping'] = null
        }

        config['name'] = this.composeConfigName(config);

        this.setState({
            config,
            errors: _.get(this.state.errors, key) ? _.omit(this.state.errors, key) : this.state.errors,
        });
    };

    onClose = () => {
        this.context.history.push('/kqi');
    };

    onIntervalChange = (start_date, end_date, regularity, groupingType) => {
        const removeKeys = [
            ...(start_date ? ['period.start_date'] : []),
            ...(end_date ? ['period.end_date'] : []),
        ];
        const config = {
            ...this.state.config,
            period: {
                start_date,
                end_date,
                regularity,
            },
            date_time_grouping: groupingType,
        };
        config.name = this.composeConfigName(config);
        this.setState({
            config,
            errors: _.omit(this.state.errors, removeKeys),
        });
    };

    onSubmit = () => {
        const { config } = this.state;
        const preparedConfig = {
            ...config,
            date_time_grouping: _.get(config, 'date_time_grouping') ? _.get(config, 'date_time_grouping') : GROUPING_TYPES.NONE,
            location_grouping: _.get(config, 'location_grouping') ? _.get(config, 'location_grouping') : GROUPING_TYPES.NONE,
            last_mile_technology_grouping: _.get(config, 'last_mile_technology_grouping') ? GROUPING_TYPES.SELF : GROUPING_TYPES.NONE,
            last_inch_technology_grouping: _.get(config, 'last_inch_technology_grouping', false) ? GROUPING_TYPES.SELF : GROUPING_TYPES.NONE,
            manufacturer_grouping: _.get(config, 'manufacturer_grouping', false) ? GROUPING_TYPES.SELF : GROUPING_TYPES.NONE,
            equipment_type_grouping: _.get(config, 'equipment_type_grouping') ? _.get(config, 'equipment_type_grouping') : GROUPING_TYPES.NONE,
            abonent_group_grouping: _.get(config, 'abonent_group_grouping') ? _.get(config, 'abonent_group_grouping') : GROUPING_TYPES.NONE,
        };

        this.props.onSubmit(preparedConfig);
    };

    render() {
        const disableForm = !!this.props.config;
        const { manufactureList } = this.props;
        const { config } = this.state;
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
                            onChange={this.setConfigProperty}
                            config={this.state.config}
                            kqiOptions={Calculator.mapListToOptions(this.props, 'kqiList')}
                            serviceTypesOptions={Calculator.mapObjectToOptions(SERVICE_TYPES)}
                            errors={this.state.errors}
                            disabled={disableForm}
                        />
                        <Period
                            groupingOptions={Calculator.mapObjectToOptions(DATE_TIME_GROUPING)}
                            errors={this.state.errors}
                            isAutoGen={_.get(this.state.config, 'period.auto', false)}
                            disabled={disableForm}
                            config={this.state.config}
                            onAutoGenChange={value => this.setConfigProperty('period.auto', value)}
                            onGroupingTypeChange={value => this.setConfigProperty('date_time_grouping', value)}
                            onIntervalChange={this.onIntervalChange}

                        />
                        <Location
                            locationOptions={Calculator.mapListToOptions(this.props, 'locationsList')}
                            groupingOptions={Calculator.mapObjectToOptions(LOCATION_GROUPING)}
                            onLocationChange={value => this.setConfigProperty('location', value)}
                            onGroupingTypeChange={value => this.setConfigProperty('location_grouping', value)}
                            config={this.state.config}
                            disabled={disableForm}
                        />
                        <Technology
                            id="last-mile-technology"
                            title={ls('KQI_CALCULATOR_LAST_MILE_TECHNOLOGY_TITLE', 'Тип технологии последней мили')}
                            label={`${ls('KQI_CALCULATOR_LAST_MILE_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПМ')}`}
                            technologies={Calculator.mapObjectToOptions(LAST_MILE_TECHNOLOGIES)}
                            onTechnologyChange={value => this.setConfigProperty('last_mile_technology', value)}
                            onGroupingChange={value => this.setConfigProperty('last_mile_technology_grouping', value)}
                            disabled={disableForm}
                            value={_.get(this.state.config, 'last_mile_technology')}
                            groupingValue={_.get(this.state.config, 'last_mile_technology_grouping')}
                        />
                        <Technology
                            id="last-inch-technology"
                            title={ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_TITLE', 'Тип технологии последнего дюйма')}
                            label={`${ls('KQI_CALCULATOR_LAST_INCH_TECHNOLOGY_FIELD_LABEL', 'Тип технологии ПД')}`}
                            technologies={Calculator.mapObjectToOptions(LAST_INCH_TECHNOLOGIES)}
                            onTechnologyChange={value => this.setConfigProperty('last_inch_technology', value)}
                            onGroupingChange={value => this.setConfigProperty('last_inch_technology_grouping', value)}
                            disabled={disableForm}
                            value={_.get(this.state.config, 'last_inch_technology')}
                            groupingValue={_.get(this.state.config, 'last_inch_technology_grouping')}
                        />
                        <div className={styles.bottomContent}>
                            <Manufacture
                                isGroupingChecked={_.get(this.state.config, 'manufacturer_grouping', false)}
                                manufactureList={manufactureList}
                                onCheckManufactures={value => this.setConfigProperty('manufacturer', value)}
                                onGroupingChange={value => this.setConfigProperty('manufacturer_grouping', value)}
                                disabled={disableForm}
                                checked={_.get(this.state.config, 'manufacturer', [])}
                                groupingValue={_.get(this.state.config, 'last_inch_technology_grouping')}
                            />
                            <div className={styles.panels}>
                                <Equipment
                                    equipmentsList={Calculator.mapListToOptions(this.props, 'equipmentsList')}
                                    onEquipmentTypeChange={value => this.setConfigProperty('equipment_type', value)}
                                    onGroupingChange={value => this.setConfigProperty('equipment_type_grouping', value)}
                                    disabled={disableForm}
                                    value={_.get(config, 'equipment_type')}
                                    groupingValue={_.get(config, 'equipment_type_grouping')}
                                />
                                <UserGroups
                                    usergroupsList={Calculator.mapListToOptions(this.props, 'usergroupsList')}
                                    onUsergroupChange={value => this.setConfigProperty('abonent_group', value)}
                                    onGroupingChange={value => this.setConfigProperty('abonent_group_grouping', value)}
                                    disabled={disableForm}
                                    value={_.get(config, 'abonent_group')}
                                    groupingValue={_.get(config, 'abonent_group_grouping')}
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
