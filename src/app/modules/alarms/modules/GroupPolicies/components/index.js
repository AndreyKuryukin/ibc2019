import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import ls from 'i18n';
import AlarmsViewer from '../modules/Viewer/containers';
import styles from './styles.scss';
import AlarmsTable from '../../../components/AlarmsTable';
import AlarmsControls from '../../../components/AlarmsControls';
import { convertUTC0ToLocal } from '../../../../../util/date';

class GroupPolicies extends React.PureComponent {
    static propTypes = {
        state: PropTypes.oneOf(['current', 'history']).isRequired,
        params: PropTypes.object,
        alarmsList: PropTypes.array,
        rfOptions: PropTypes.array,
        mrfOptions: PropTypes.array,
        filter: PropTypes.object,
        onMount: PropTypes.func,
        onChangeFilterProperty: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        filter: null,
        params: null,
        alarmsList: [],
        rfOptions: [],
        mrfOptions: [],
        onMount: () => null,
        onChangeFilterProperty: () => null,
        onFetchAlarms: () => null,
        isLoading: false,
    };

    static mapOptions = memoize(opts => opts.map(opt => ({ value: opt.id, title: opt.name })));

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount(this.props.filter);
        }
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

    onApplyFilter = () => {
        this.props.onFetchAlarms(this.props.filter);
    };

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    render() {
        const {
            params = {},
            filter,
            isLoading,
            alarmsList,
            onChangeFilterProperty,
            rfOptions,
            mrfOptions,
        } = this.props;
        const { id: alarmId } = params;
        const isAlarmsViewerActive = !!alarmId;

        return (
            <div className={styles.groupPoliciesWrapper}>
                <AlarmsControls
                    filter={filter}
                    onChangeFilterProperty={onChangeFilterProperty}
                    onSearchTextChange={this.onSearchTextChange}
                    onApplyFilter={this.onApplyFilter}
                    rfOptions={GroupPolicies.mapOptions(rfOptions)}
                    mrfOptions={GroupPolicies.mapOptions(mrfOptions)}
                />
                <AlarmsTable
                    data={this.mapData(alarmsList)}
                    preloader={isLoading}
                    searchText={this.state.searchText}
                />
                {isAlarmsViewerActive && <AlarmsViewer alarmId={alarmId} active={isAlarmsViewerActive} />}
            </div>
        );
    }
}

export default GroupPolicies;
