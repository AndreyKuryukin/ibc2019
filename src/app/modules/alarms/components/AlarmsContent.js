import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';
import AlarmsTable from './AlarmsTable';
import AlarmsControls from './AlarmsControls';
import AlarmsViewer from '../modules/Viewer/containers';
import { ALARMS_TYPES } from '../constants';

class AlarmsContent extends React.PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
        params: PropTypes.object,
        filter: PropTypes.object,
        alarms: PropTypes.array,
        locations: PropTypes.array,
        onChangeFilter: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        filter: null,
        alarms: [],
        mrfOptions: [],
        onChangeFilter: () => null,
        onFetchAlarms: () => null,
        isLoading: false,
    };

    componentDidMount() {
        this.props.onFetchAlarms(this.props.filter);
    }

    onApplyFilter = () => {
        this.props.onFetchAlarms(this.props.filter);
    };

    render() {
        const {
            type,
            params,
            filter,
            alarms: data,
            locations,
            onChangeFilter,
            isLoading,
        } = this.props;

        const { id: alarmId } = params;
        const isAlarmsViewerActive = !!alarmId;

        return (
            <div className={styles.alarmsContentWrapper}>
                <AlarmsControls
                    filter={filter}
                    onChangeFilter={onChangeFilter}
                    onApplyFilter={this.onApplyFilter}
                    locations={locations}
                />
                <AlarmsTable
                    type={type}
                    data={data}
                    preloader={isLoading}
                    searchText={_.get(filter, 'searchText', '')}
                />
                {isAlarmsViewerActive && <AlarmsViewer alarmId={alarmId} active={isAlarmsViewerActive} type={type} />}
            </div>
        );
    }
}

export default AlarmsContent;
