import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import moment from 'moment';
import memoize from 'memoizejs';
import XLSX from 'xlsx';
import Field from '../../../components/Field';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import DatePicker from '../../../components/DateTimePicker';
import Dropdown from '../../../components/Dropdown';
import styles from './styles.scss';
import { FILTER_FIELDS } from '../constants';

const DATE_PICKER_DEFAULT_STYLE = {
    color: '#aaa',
    fontStyle: 'italic',
};

class AlertsControls extends React.Component {
    static propTypes = {
        current: PropTypes.number,
        total: PropTypes.number,
        onChangeFilter: PropTypes.func,
        onApplyFilter: PropTypes.func,
        onExportXLSX: PropTypes.func,
        onFilterAlerts: PropTypes.func,
        locations: PropTypes.array,
        policies: PropTypes.array,
        filter: PropTypes.shape({
            start: PropTypes.instanceOf(Date),
            end: PropTypes.instanceOf(Date),
            rf: PropTypes.string,
            mrf: PropTypes.string,
            current: PropTypes.bool,
            historical: PropTypes.bool,
            auto_refresh: PropTypes.bool,
        }),
    };

    static defaultProps = {
        current: 0,
        total: 0,
        onChangeFilter: () => null,
        onApplyFilter: () => null,
        onExportXLSX: () => null,
        onFilterAlerts: () => null,
        locations: [],
        policies: [],
        filter: null,
    };

    static mapOptions = memoize(opts => opts.map(opt => ({ value: opt.id, title: opt.name })));

    constructor(props) {
        super(props);

        this.state = {
            hasDatePickersDefaultStyle: false,
            isDatePickersValid: true,
            isHistoricalConfirmOpen: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const isFilterChanged = this.props.filter !== nextProps.filter;
        const isLocationsChanged = this.props.locations !== nextProps.locations;
        const isOnChangeFilterChanged = this.props.onChangeFilter !== nextProps.onChangeFilter;
        const isOnApplyFilterChanged = this.props.onApplyFilter !== nextProps.onApplyFilter;
        const isHistoricalConfirmOpenChanged = this.state.isHistoricalConfirmOpen !== nextState.isHistoricalConfirmOpen;

        return isFilterChanged || isLocationsChanged || isOnChangeFilterChanged || isOnApplyFilterChanged || isHistoricalConfirmOpenChanged;
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.filter.start && !nextProps.filter.end) {
            this.setState({ isDatePickersValid: nextProps.filter.auto_refresh !== this.props.filter.auto_refresh });
        }

        if (this.props.filter.auto_refresh && !nextProps.filter.auto_refresh) {
            this.setState({ hasDatePickersDefaultStyle: true });
        }
    }

    getFilterProperty = (key, defaultValue) => _.get(this.props.filter, key, defaultValue);
    setFilterProperty = (property, value) => {
        const { filter } = this.props;
        const newFilter = {
            ...filter,
            [property]: value,
        };

        if (property === 'mrf') {
            _.set(newFilter, 'rf', '');
        }

        if ((property === 'start' || property === 'end')) {
            this.setState({
                hasDatePickersDefaultStyle: false,
                isDatePickersValid: true,
            });
        }

        if (property === 'auto_refresh' && !value) {
            _.set(newFilter, 'start', moment().subtract(1, 'hours').toDate());
            _.set(newFilter, 'end', moment().toDate());
        }

        this.props.onChangeFilter(newFilter);
    };

    getRfOptions = () => {
        const selectedMrfId = this.getFilterProperty('mrf', '');
        const selectedMrf = this.props.locations.find(mrf => mrf.id === selectedMrfId);

        return selectedMrf ? AlertsControls.mapOptions(selectedMrf.rf) : [];
    };

    checkHistorical = () => {
        this.setFilterProperty('historical', true);
        this.onTriggerHistoricalDropdown();
    };

    onApplyFilter = () => {
        this.props.onApplyFilter(this.props.filter);
    };

    onTriggerHistoricalDropdown = () => {
        this.setState({ isHistoricalConfirmOpen: !this.state.isHistoricalConfirmOpen });
    };

    render() {
        const { locations, policies, current, total } = this.props;

        return (
            <div className={styles.alertsControls}>
                <div className={styles.alertsFilterGroups}>
                    <div className={styles.alertsFilterGroup}>
                        <Field
                            id="auto-refresh-filter"
                            labelText={ls('ALERTS_AUTO_REFRESH_FILTER', 'Автообновление')}
                            inputWidth={12}
                            labelAlign="right"
                            splitter=""
                        >
                            <Checkbox
                                itemId="alerts_auto_refresh_check"
                                id="auto-refresh-filter"
                                checked={this.getFilterProperty('auto_refresh', false)}
                                onChange={value => this.setFilterProperty('auto_refresh', value)}
                            />
                        </Field>
                    </div>
                    <div className={styles.alertsFilterGroup}>
                        <Field
                            id="alerts-filter-start"
                            labelText={ls('ALERTS_START_FILTER', 'Показать аварии с')}
                            inputWidth={160}
                            labelWidth={110}
                            splitter=""
                        >
                            <DatePicker
                                itemId="alerts_start"
                                max={this.getFilterProperty('end')}
                                value={this.getFilterProperty('start')}
                                inputWidth={115}
                                onChange={value => this.setFilterProperty('start', value)}
                                format={'DD.MM.YYYY HH:mm'}
                                time
                                disabled={this.getFilterProperty('auto_refresh', false)}
                                inputStyle={this.state.hasDatePickersDefaultStyle ? DATE_PICKER_DEFAULT_STYLE : null}
                                placeholder={ls('ALERTS_FROM_FILTER_PLACEHOLDER', 'Начало')}
                                valid={this.state.isDatePickersValid}
                                title={!this.state.isDatePickersValid && 'Одно из полей дат начала и окончания должно быть заполнено'}
                            />
                        </Field>
                        <Field
                            id="alerts-filter-end"
                            labelText={ls('ALERTS_END_FILTER', 'по')}
                            inputWidth={160}
                            labelWidth={110}
                            splitter=""
                        >
                            <DatePicker
                                itemId="alerts_end"
                                min={this.getFilterProperty('start')}
                                value={this.getFilterProperty('end')}
                                inputWidth={115}
                                onChange={value => this.setFilterProperty('end', value)}
                                format={'DD.MM.YYYY HH:mm'}
                                time
                                disabled={this.getFilterProperty('auto_refresh', false)}
                                inputStyle={this.state.hasDatePickersDefaultStyle ? DATE_PICKER_DEFAULT_STYLE : null}
                                placeholder={ls('ALERTS_TO_FILTER_PLACEHOLDER', 'Окончание')}
                                valid={this.state.isDatePickersValid}
                                title={!this.state.isDatePickersValid && 'Одно из полей дат начала и окончания должно быть заполнено'}
                            />
                        </Field>
                    </div>
                    <div className={styles.alertsFilterGroup}>
                        <Field
                            id="mrf-filter"
                            labelText={ls('ALERTS_MRF_FILTER', 'Фильтр по МРФ')}
                            inputWidth={300}
                            labelWidth={120}
                            splitter=""
                        >
                            <Select
                                itemId="alerts_mrf"
                                id="mrf-filter"
                                options={AlertsControls.mapOptions(locations)}
                                value={this.getFilterProperty('mrf', '')}
                                onChange={value => this.setFilterProperty('mrf', value)}
                                placeholder={ls('ALERTS_MRF_FILTER_PLACEHOLDER', 'МРФ')}
                            />
                        </Field>
                        <Field
                            id="region-filter"
                            labelText={ls('ALERTS_REGION_FILTER', 'Фильтр по региону')}
                            inputWidth={300}
                            labelWidth={120}
                            splitter=""
                        >
                            <Select
                                itemId="alerts_rf"
                                id="region-filter"
                                options={this.getRfOptions()}
                                value={this.getFilterProperty('rf', '')}
                                onChange={value => this.setFilterProperty('rf', value)}
                                disabled={!this.getFilterProperty('mrf', '')}
                                placeholder={ls('ALERTS_REGION_FILTER_PLACEHOLDER', 'Регион')}
                            />
                        </Field>
                        <Field
                            id="policy-filter"
                            labelText={ls('ALERTS_POLICY_FILTER', 'Фильтр по политике')}
                            inputWidth={300}
                            labelWidth={120}
                            splitter=""
                        >
                            <Select
                                itemId="alerts_policy"
                                id="policy-filter"
                                options={AlertsControls.mapOptions(policies)}
                                value={this.getFilterProperty('policyId', '')}
                                onChange={value => this.setFilterProperty('policyId', value)}
                                placeholder={ls('ALERTS_POLICY_FILTER_PLACEHOLDER', 'Политика')}
                            />
                        </Field>
                    </div>
                    <div className={styles.alertsFilterGroup}>
                        <Field
                            id="current-checkbox-filter"
                            labelText={ls('ALERTS_CURRENT_FILTER', 'Текущие')}
                            inputWidth={12}
                            labelAlign="right"
                            splitter=""
                        >
                            <Checkbox
                                itemId="alerts_current_check"
                                id="current-checkbox-filter"
                                checked={this.getFilterProperty('current', false)}
                                onChange={value => this.setFilterProperty('current', value)}
                            />
                        </Field>
                        <Field
                            id="historical-checkbox-filter"
                            labelText={ls('ALERTS_HISTORICAL_FILTER', 'Исторические')}
                            inputWidth={12}
                            labelAlign="right"
                            splitter=""
                        >
                            <Dropdown
                                isOpen={this.state.isHistoricalConfirmOpen}
                                dropdownClass={styles.historicalDropdown}
                                onToggle={() => null}
                                trigger={
                                    <Checkbox
                                        itemId="alerts_historical_check"
                                        id="historical-checkbox-filter"
                                        checked={this.getFilterProperty('historical', false)}
                                        onChange={this.getFilterProperty('historical', false)
                                            ? () => this.setFilterProperty('historical', false)
                                            : this.onTriggerHistoricalDropdown}
                                    />
                                }
                            >
                                <div className={styles.warningMsg}>
                                    {ls('ATTENTION', 'Внимание!')}
                                    <br/>
                                    {ls('ALERTS_HISTORICAL_WARNING_MESSAGE', 'Загрузка архивных аварий может занять длительное время')}
                                </div>
                                <div className={styles.buttonWrapper}>
                                    <Button itemId="alerts_cancel_historical" outline color="action" onClick={this.onTriggerHistoricalDropdown}>
                                        {ls('CANCEL', 'Отмена')}
                                    </Button>
                                    <Button itemId="alerts_confirm_historical" color="action" onClick={this.checkHistorical}>
                                        {ls('CONTINUE', 'Продолжить')}
                                    </Button>
                                </div>
                            </Dropdown>
                        </Field>
                    </div>
                    <div className={styles.alertsFilterGroup}>
                        <Button itemId="alerts_apply" className={styles.applyButton} color="action" onClick={this.onApplyFilter}>
                            {ls('ALERTS_APPLY_FILTER', 'Применить')}
                        </Button>
                        <Button itemId="alerts_export" className={styles.applyButton} color="action" onClick={this.props.onExportXLSX}>
                            {ls('ALERTS_LOAD_XLSX', 'Экспорт в XLSX')}
                        </Button>
                    </div>
                </div>
                <div className={styles.alertsFilterGroup}>
                    <Input
                        itemId="alerts_search_field"
                        placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                        className={styles.search}
                        value={this.getFilterProperty('filter', false)}
                        onChange={value => this.setFilterProperty('filter', value)}
                    />
                    <div className={styles.statistics}>{current + '/' + total}</div>
                </div>
            </div>
        );
    }
}

export default AlertsControls;
