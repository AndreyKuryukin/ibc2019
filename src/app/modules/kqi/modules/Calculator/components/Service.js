import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import Panel from '../../../../../components/Panel';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Checkbox from '../../../../../components/Checkbox';
import { SERVICE_TYPES } from '../constants.js';
import styles from './styles.scss';

const fieldStyle = { flex: '1 1 0' };

class Service extends React.PureComponent {
    static propTypes = {
        service: PropTypes.string,
        isGroupingChecked: PropTypes.bool,
        disabled: PropTypes.bool,
        onServiceChange: PropTypes.func,
        onGroupingChange: PropTypes.func,
    };

    static defaultProps = {
        service: '',
        isGroupingChecked: false,
        disabled: false,
        onServiceChange: () => null,
        onGroupingChange: () => null,
    };

    getServicesOptions = () => SERVICE_TYPES.map(service => ({ value: service, title: ls(`CONTENT_${service}_TYPE_OPTION`, service) }));

    render() {
        const { service, isGroupingChecked, disabled, onServiceChange, onGroupingChange } = this.props;

        return (
            <Panel
                title={ls('KQI_CALCULATOR_SERVICE_TITLE', 'Услуга')}
                horizontal
            >
                <Field
                    id="content-type"
                    labelText={ls('KQI_CALCULATOR_CONTENT_TYPE_FIELD_LABEL', 'Услуга')}
                    labelWidth="32%"
                    inputWidth="66%"
                    style={fieldStyle}
                >
                    <Select
                        itemId="kqi_projections_service_field"
                        id="content-type"
                        placeholder={ls('KQI_CALCULATOR_CONTENT_TYPE_FIELD_PLACEHOLDER', 'Выберите услугу')}
                        options={this.getServicesOptions()}
                        onChange={onServiceChange}
                        value={service}
                        disabled={disabled}
                    />
                </Field>
                <div className={styles.groupingBlock}>
                    <Field
                        id="content-type-grouping"
                        labelText={ls('KQI_CALCULATOR_CONTENT_TYPE_GROUPING_FIELD_LABEL', 'С группировкой по услуге')}
                        inputWidth={25}
                        labelWidth={405}
                        labelAlign="right"
                        splitter=""
                        style={fieldStyle}
                    >
                        <Checkbox
                            itemId="kqi_projections_service_grouping_check"
                            id="content-type-grouping"
                            checked={isGroupingChecked}
                            onChange={onGroupingChange}
                            disabled={disabled || service}
                        />
                    </Field>
                </div>
            </Panel>
        );
    }
}

export default Service;