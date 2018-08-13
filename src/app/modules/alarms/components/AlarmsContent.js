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
        onExportXLSX: PropTypes.func,
        onFilterAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        filter: null,
        alarms: [],
        mrfOptions: [],
        onChangeFilter: () => null,
        onFetchAlarms: () => null,
        onExportXLSX: () => null,
        onFilterAlarms: () => null,
        isLoading: false,
    };

    componentDidMount() {
        this.props.onFetchAlarms(this.props.filter);
    }

    onApplyFilter = () => {
        this.props.onFetchAlarms(this.props.filter);
    };

    onExportXLSX = () => {
        this.props.onExportXLSX(this.props.filter);
    };

    onFilterAlarms = (searchText) => {
        this.props.onFilterAlarms(this.props.filter, searchText);
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
                    onFilterAlarms={this.onFilterAlarms}
                    onApplyFilter={this.onApplyFilter}
                    onExportXLSX={this.onExportXLSX}
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
