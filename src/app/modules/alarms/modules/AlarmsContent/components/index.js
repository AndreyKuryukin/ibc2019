import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import ls from 'i18n';
import _ from 'lodash';
import styles from './styles.scss';
import AlarmsTable from '../../../components/AlarmsTable';
import AlarmsControls from '../../../components/AlarmsControls';
import { convertUTC0ToLocal } from '../../../../../util/date';

class AlarmsContent extends React.PureComponent {
    static propTypes = {
        params: PropTypes.object,
        filter: PropTypes.object,
        alarms: PropTypes.array,
        mrfOptions: PropTypes.array,
        onMount: PropTypes.func,
        onChangeFilterProperty: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        filter: null,
        alarms: [],
        mrfOptions: [],
        onMount: () => null,
        onChangeFilterProperty: () => null,
        onFetchAlarms: () => null,
        isLoading: false,
    };

    componentDidMount() {
        this.props.onFetchAlarms(this.props.filter);
    }

    onApplyFilter = () => {
        this.props.onFetchAlarms(this.props.filter);
    };

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

    render() {
        const {
            filter,
            alarms: data,
            mrfOptions,
            onChangeFilterProperty,
            isLoading,
        } = this.props;
        return (
            <div className={styles.alarmsContentWrapper}>
                <AlarmsControls
                    filter={filter}
                    onChangeFilterProperty={onChangeFilterProperty}
                    onApplyFilter={this.onApplyFilter}
                    mrfOptions={mrfOptions}
                />
                <AlarmsTable
                    data={this.mapData(data)}
                    preloader={isLoading}
                    searchText={_.get(filter, 'searchText', '')}
                />
            </div>
        );
    }
}

export default AlarmsContent;
