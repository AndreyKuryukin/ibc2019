import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';

import Modal from "../../../../../components/Modal";
import Preloader from "../../../../../components/Preloader";
import ls from "i18n";
import Panel from "../../../../../components/Panel/index";
import Table from "../../../../../components/Table/index";
import Field from "../../../../../components/Field/index";
import { DATE, INTERVALS, TIME_DATE, TIME_MINUTES } from '../../../../../costants/date';

import _ from "lodash";
import moment from "moment";
import DefaultCell from "../../../../../components/Table/Cells/DefaultCell";

const priorityMap = {
    UNDEFINED: ''
};

const periodMap = _.reduce(INTERVALS, (result, interval) => {
        result[String(interval).toUpperCase()] = ls(`CRASHES_KQI_HISTORY_DETAIL_PERIOD_${String(interval).toUpperCase()}`);
        return result;
    }, { DEFAULT: '' }
);

class Details extends React.PureComponent {

    static propTypes = {
        detail: PropTypes.object,
        active: PropTypes.bool,
        detailLoading: PropTypes.bool,
    };

    static defaultProps = {
        detail: {},
        active: false,
        detailLoading: false,
    };

    getColumns = memoize(() => [{
        title: ls('CRASHES_KQI_HISTORY_DETAIL_LOCATION_TITLE', 'Филиал'),
        name: 'location',
        searchable: true,
        sortable: true,
    }, {
        title: ls('CRASHES_KQI_HISTORY_DETAIL_LM_TITLE', 'Технология ПМ'),
        name: 'last_mile_technology',
        searchable: true,
        sortable: true,
    }, {
        title: ls('CRASHES_KQI_HISTORY_DETAIL_RESULT_TITLE', 'Результат'),
        name: 'value',
        searchable: true,
        sortable: true,
    }, {
        title: ls('CRASHES_KQI_HISTORY_DETAIL_WEIGHT_TITLE', 'Вносимый вес'),
        name: 'weight',
        searchable: true,
        sortable: true,
    }]);


    headerRowRender = (column, sort) => {
        switch (column.name) {
            default:
                return (
                    <DefaultCell
                        content={column.title}
                        sortDirection={sort.by === column.name ? sort.direction : null}
                    />
                );
        }
    };

    bodyRowRender = (column, node) => {
        const value = node[column.name] || '';
        return <DefaultCell
            content={value}
        />
    };

    mapData = details => {
        return details;
    };

    composeDetailName = detail => `${ls('CRASHES_KQI_HISTORY_DETAIL_TITLE', 'Детальная информация по KQI аварии №')}${detail.id || ''}(${priorityMap[String(detail.priority).toUpperCase()]})`;

    render() {
        const { detail, active } = this.props;
        return <Modal
            isOpen={active}
            title={this.composeDetailName(detail)}
            onClose={this.props.onSubmit}
            onSubmit={this.props.onSubmit}
            submitTitle={ls('OK', 'Ok')}
            cancelTitle={ls('CANCEL', 'Cancel')}
        >

            <Panel title={ls('CRASHES_KQI_HISTORY_DETAIL_INFO_TITLE', 'Информация')}>
                <Field
                    id="raise_time"
                    labelText={ls('CRASHES_KQI_HISTORY_DETAIL_RAISE_TIME', 'Время возникновения')}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    {moment(_.get(detail, 'raise_time')).format(`${TIME_MINUTES} ${DATE}`)}
                </Field>
                <Field
                    id="password"
                    labelText={ls('USER_PASSWORD_FIELD_TITLE', 'Название политики по каталогу')}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    {_.get(detail, 'policy_name')}
                </Field>
                <Field
                    id="confirm"
                    labelText={ls('USER_CONFIRM_FIELD_TITLE', 'Периодичность вычисления')}
                    labelWidth="50%"
                    inputWidth="50%"
                >
                    {periodMap[_.get(detail, 'period', 'DEFAULT').toUpperCase()]}
                </Field>
            </Panel>
            <Panel title={ls('CRASHES_KQI_HISTORY_DETAIL_TABLE_TITLE', 'Записи с нарушением условия политики по KQI')}
                   style={{ height: 300, marginTop: 1 }}
                   bodyStyle={{ padding: 0 }}
            >
                <Preloader active={this.props.detailLoading}>
                    <Table data={this.mapData(_.get(detail, 'details'))}
                           columns={this.getColumns()}
                           headerRowRender={this.headerRowRender}
                           bodyRowRender={this.bodyRowRender}/>
                </Preloader>
            </Panel>

        </Modal>
    }
}

export default Details;