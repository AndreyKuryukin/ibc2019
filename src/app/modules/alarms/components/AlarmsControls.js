import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import memoize from 'memoizejs';
import Field from '../../../components/Field';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import DatePicker from '../../../components/LabeledDateTimePicker';
import Dropdown from '../../../components/Dropdown';
import styles from './styles.scss';

const filterControlStyle = {
    marginLeft: 10,
    marginTop: 0,
};

class AlarmsControls extends React.PureComponent {
    static propTypes = {
        onChangeFilter: PropTypes.func,
        onApplyFilter: PropTypes.func,
        locations: PropTypes.array,
        filter: PropTypes.shape({
            start: PropTypes.instanceOf(Date),
            end: PropTypes.instanceOf(Date),
            rf: PropTypes.string,
            mrf: PropTypes.string,
            current: PropTypes.bool,
            historical: PropTypes.bool,
        }),
    };

    static defaultProps = {
        onChangeFilter: () => null,
        onApplyFilter: () => null,
        locations: [],
        filter: null,
    };

    static mapOptions = memoize(opts => opts.map(opt => ({ value: opt.id, title: opt.name })));

    constructor(props) {
        super(props);

        this.state = {
            isHistoricalConfirmOpen: false,
        };
    }

    getFilterProperty = (key, defaultValue) => _.get(this.props.filter, key, defaultValue);
    setFilterProperty = (property, value) => {
        const { filter } = this.props;
        const newFilter = {
            ...filter,
            [property]: value,
        };
        this.props.onChangeFilter(newFilter);
    };

    getRfOptions = () => {
        const selectedMrfId = this.getFilterProperty('mrf', '');
        const selectedMrf = this.props.locations.find(mrf => mrf.id === selectedMrfId);

        return selectedMrf ? AlarmsControls.mapOptions(selectedMrf.rf) : [];
    };

    checkHistorical = () => {
        this.setFilterProperty('historical', true);
        this.onTriggerHistoricalDropdown();
    }

    onApplyFilter = () => {
        this.props.onApplyFilter(this.props.filter);
    };

    onSearchTextChange = (value) => {
        this.setFilterProperty('searchText', value);
    };

    onTriggerHistoricalDropdown = () => {
        this.setState({ isHistoricalConfirmOpen: !this.state.isHistoricalConfirmOpen });
    }

    render() {
        const { locations } = this.props;

        return (
            <div className={styles.alarmsControls}>
                <div className={styles.alarmsFilterGroups}>
                    <div className={styles.alarmsFilterGroup}>
                        <DatePicker
                            title={ls('ALARMS_START_FILTER', 'Показать аварии с')}
                            value={this.getFilterProperty('start')}
                            inputWidth={115}
                            onChange={value => this.setFilterProperty('start', value)}
                            format={'DD.MM.YYYY HH:mm'}
                            time
                        />
                        <DatePicker
                            title={ls('ALARMS_END_FILTER', 'по')}
                            min={this.getFilterProperty('start')}
                            value={this.getFilterProperty('end')}
                            inputWidth={115}
                            onChange={value => this.setFilterProperty('end', value)}
                            style={filterControlStyle}
                            format={'DD.MM.YYYY HH:mm'}
                            time
                        />
                    </div>
                    <div className={styles.alarmsFilterGroup}>
                        <Field
                            id="mrf-filter"
                            labelText={ls('ALARMS_MRF_FILTER', 'Фильтр по МРФ')}
                            inputWidth={150}
                            splitter=""
                        >
                            <Select
                                id="mrf-filter"
                                options={AlarmsControls.mapOptions(locations)}
                                value={this.getFilterProperty('mrf', '')}
                                onChange={value => this.setFilterProperty('mrf', value)}
                                placeholder={ls('ALARMS_MRF_FILTER_PLACEHOLDER', 'МРФ')}
                            />
                        </Field>
                        <Field
                            id="region-filter"
                            labelText={ls('ALARMS_REGION_FILTER', 'Фильтр по региону')}
                            inputWidth={150}
                            splitter=""
                            style={filterControlStyle}
                        >
                            <Select
                                id="region-filter"
                                options={this.getRfOptions()}
                                value={this.getFilterProperty('rf', '')}
                                onChange={value => this.setFilterProperty('rf', value)}
                                placeholder={ls('ALARMS_REGION_FILTER_PLACEHOLDER', 'Регион')}
                            />
                        </Field>
                    </div>
                    <div className={styles.alarmsFilterGroup}>
                        <Field
                            id="current-checkbox-filter"
                            labelText={ls('ALARMS_CURRENT_FILTER', 'Текущие')}
                            inputWidth={12}
                            labelAlign="right"
                            splitter=""
                        >
                            <Checkbox
                                id="current-checkbox-filter"
                                checked={this.getFilterProperty('current', false)}
                                onChange={value => this.setFilterProperty('current', value)}
                            />
                        </Field>
                        <Field
                            id="historical-checkbox-filter"
                            labelText={ls('ALARMS_HISTORICAL_FILTER', 'Исторические')}
                            inputWidth={12}
                            labelAlign="right"
                            splitter=""
                            style={filterControlStyle}
                        >
                            <Dropdown
                                isOpen={this.state.isHistoricalConfirmOpen}
                                dropdownClass={styles.historicalDropdown}
                                onToggle={() => null}
                                trigger={
                                    <Checkbox
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
                                    {ls('ALARMS_HISTORICAL_WARNING_MESSAGE', 'Загрузка архивных аварий может занять длительное время')}
                                </div>
                                <div className={styles.buttonWrapper}>
                                    <Button outline color="action" onClick={this.onTriggerHistoricalDropdown}>
                                        {ls('CANCEL', 'Отмена')}
                                    </Button>
                                    <Button color="action" onClick={this.checkHistorical}>
                                        {ls('CONTINUE', 'Продолжить')}
                                    </Button>
                                </div>
                            </Dropdown>
                        </Field>
                    </div>
                    <Button className={styles.applyButton} color="action" onClick={this.onApplyFilter}>
                        {ls('ALARMS_APPLY_FILTER', 'ОК')}
                    </Button>
                </div>
                <Input
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default AlarmsControls;
