import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';
import AlertsTable from './AlertsTable';
import AlertsControls from './AlertsControls';
import AlertsViewer from '../modules/Viewer/containers';
import { ALERTS_TYPES } from '../constants';
import { getQueryParams } from "../../../util/state";

class AlertsContent extends React.PureComponent {
    static contextTypes = {
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        type: PropTypes.oneOf(ALERTS_TYPES).isRequired,
        params: PropTypes.object,
        filter: PropTypes.object,
        alerts: PropTypes.object,
        locations: PropTypes.array,
        policies: PropTypes.array,
        columns: PropTypes.array,
        onChangeFilter: PropTypes.func,
        onFetchAlerts: PropTypes.func,
        onExportXLSX: PropTypes.func,
        onFilterAlerts: PropTypes.func,
        onReadNewAlert: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        params: null,
        filter: null,
        alerts: {},
        policies: [],
        mrfOptions: [],
        columns: [],
        onChangeFilter: () => null,
        onFetchAlerts: () => null,
        onExportXLSX: () => null,
        onFilterAlerts: () => null,
        onReadNewAlert: () => null,
        isLoading: false,
    };

    onApplyFilter = () => {
        this.props.onFetchAlerts(this.props.filter);
    };

    onExportXLSX = () => {
        this.props.onExportXLSX(this.props.filter);
    };

    render() {
        const {
            type,
            params,
            filter,
            alerts,
            locations,
            policies,
            onChangeFilter,
            isLoading,
            columns
        } = this.props;

        const { id: alertId } = params;
        const isAlertsViewerActive = !!alertId;
        const { alerts: data, total } = alerts;

        return (
            <div className={styles.alertsContentWrapper}>
                <AlertsControls
                    current={data.length}
                    total={total}
                    filter={filter}
                    onChangeFilter={onChangeFilter}
                    onApplyFilter={this.onApplyFilter}
                    onExportXLSX={this.onExportXLSX}
                    locations={locations}
                    policies={policies}
                />
                <AlertsTable
                    type={type}
                    data={data}
                    preloader={isLoading}
                    searchText={_.get(filter, 'filter', '')}
                    onReadNewAlert={this.props.onReadNewAlert}
                    columns={columns}
                />
                {isAlertsViewerActive && <AlertsViewer alertId={alertId} active={isAlertsViewerActive} type={type}/>}
            </div>
        );
    }
}

export default AlertsContent;
