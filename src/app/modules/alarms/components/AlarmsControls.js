import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import memoize from 'memoizejs';
import Field from '../../../components/Field';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import DatePicker from '../../../components/LabeledDateTimePicker';
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

    onApplyFilter = () => {
        this.props.onApplyFilter(this.props.filter);
    };

    onSearchTextChange = (event) => {
        this.setFilterProperty('searchText', _.get(event, 'currentTarget.value', ''));
    };

    render() {
        const { locations } = this.props;

        return (
            <div className={styles.alarmsControls}>
                <div className={styles.alarmsFilterGroups}>
                    <div className={styles.alarmsFilterGroup}>
                        <DatePicker
                            title={ls('ALARMS_START_FILTER', 'Показать аварии с')}
                            value={this.getFilterProperty('start')}
                            inputWidth={80}
                            onChange={value => this.setFilterProperty('start', value)}
                        />
                        <DatePicker
                            title={ls('ALARMS_END_FILTER', 'по')}
                            min={this.getFilterProperty('start')}
                            value={this.getFilterProperty('end')}
                            inputWidth={80}
                            onChange={value => this.setFilterProperty('end', value)}
                            style={filterControlStyle}
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
                            inputWidth={15}
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
                            inputWidth={15}
                            labelAlign="right"
                            splitter=""
                            style={filterControlStyle}
                        >
                            <Checkbox
                                id="historical-checkbox-filter"
                                checked={this.getFilterProperty('historical', false)}
                                onChange={value => this.setFilterProperty('historical', value)}
                            />
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
