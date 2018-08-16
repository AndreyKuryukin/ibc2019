import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';
import AlarmsTable from './AlarmsTable';
import AlarmsControls from './AlarmsControls';
import AlarmsViewer from '../modules/Viewer/containers';
import { ALARMS_TYPES } from '../constants';
import { getQueryParams } from "../../../util/state";

class AlarmsContent extends React.PureComponent {
    static contextTypes = {
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALARMS_TYPES).isRequired,
        params: PropTypes.object,
        filter: PropTypes.object,
        alarms: PropTypes.object,
        locations: PropTypes.array,
        policies: PropTypes.array,
        onChangeFilter: PropTypes.func,
        onFetchAlarms: PropTypes.func,
        onExportXLSX: PropTypes.func,
        onFilterAlarms: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        filter: null,
        alarms: {},
        policies: [],
        mrfOptions: [],
        onChangeFilter: () => null,
        onFetchAlarms: () => null,
        onExportXLSX: () => null,
        onFilterAlarms: () => null,
        isLoading: false,
    };

    componentDidMount() {
        const queryParams = getQueryParams(this.context.location);
        let filter = this.props.filter;

        if (!_.isEmpty(queryParams)) {
            filter = {
                ...queryParams,
                start: new Date(+queryParams.start),
                end: new Date(+queryParams.end),
                filter: _.get(this.props.filter, 'filter', ''),
            };

            this.props.onChangeFilter(filter);
        }

        this.props.onFetchAlarms(filter);
    }

    onApplyFilter = () => {
        this.props.onFetchAlarms(this.props.filter);
    };

    onExportXLSX = () => {
        this.props.onExportXLSX(this.props.filter);
    };

    render() {
        const {
            type,
            params,
            filter,
            alarms,
            locations,
            policies,
            onChangeFilter,
            isLoading,
        } = this.props;

        const { id: alarmId } = params;
        const isAlarmsViewerActive = !!alarmId;
        const { alarms: data, total } = alarms;

        return (
            <div className={styles.alarmsContentWrapper}>
                <AlarmsControls
                    current={data.length}
                    total={total}
                    filter={filter}
                    onChangeFilter={onChangeFilter}
                    onApplyFilter={this.onApplyFilter}
                    onExportXLSX={this.onExportXLSX}
                    locations={locations}
                    policies={policies}
                />
                <AlarmsTable
                    type={type}
                    data={data}
                    preloader={isLoading}
                    searchText={_.get(filter, 'filter', '')}
                />
                {isAlarmsViewerActive && <AlarmsViewer alarmId={alarmId} active={isAlarmsViewerActive} type={type} />}
            </div>
        );
    }
}

export default AlarmsContent;
