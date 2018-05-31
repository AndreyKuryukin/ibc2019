import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import ls from 'i18n';
import styles from './styles.scss';
import AlarmsTable from '../../../components/AlarmsTable';
import AlarmsControls from '../../../components/AlarmsControls';
import { convertUTC0ToLocal } from '../../../../../util/date';

class ClientsIncidents extends React.PureComponent {
    static propTypes = {
        filter: PropTypes.object,
        data: PropTypes.array,
        onMount: PropTypes.func,
        onChangeFilterProperty: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        onApplyFilter: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        filter: null,
        data: [],
        onMount: () => null,
        onChangeFilterProperty: () => null,
        onFetchAlarms: () => null,
        onApplyFilter: () => null,
        isLoading: false
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALARMS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    mapData = memoize(data => data.map(node => ({
        id: node.id.toString(),
        policy_name: node.policy_name,
        raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD:MM:YYYY'),
        duration: this.getReadableDuration(node.duration),
        object: node.object,
    })));

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    render() {
        const { filter, data, onChangeFilterProperty, isLoading } = this.props;
        return (
            <div className={styles.clientsIncidentsWrapper}>
                <AlarmsControls
                    filter={filter}
                    onChangeFilterProperty={onChangeFilterProperty}
                    onSearchTextChange={this.onSearchTextChange}
                    onApplyFilter={this.onApplyFilter}
                    rfOptions={[]}
                    mrfOptions={[]}
                />
                <AlarmsTable
                    data={this.mapData(data)}
                    preloader={isLoading}
                    searchText={this.state.searchText}
                />
            </div>
        );
    }
}

export default ClientsIncidents;
