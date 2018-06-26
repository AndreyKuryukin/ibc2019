import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';
import ConnectedChart from './ConnectedChart';
import ls from '../../../../../i18n';

class KIDuration extends React.Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            count: PropTypes.number,
            duration: PropTypes.number,
        })).isRequired,
    };

    getChartOptions() {
        const series = this.getSeries();
        const categories = this.getCategories();

        return {
            chart: {
                type: 'column',
            },
            title: {
                text: '',
            },
            colors: [
                '#377dc4',
            ],
            tooltip: {
                ...Chart.DEFAULT_OPTIONS.tooltip,
                shared: true,
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b> сек<br/>',
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                plotOptions: {
                    column: Chart.DEFAULT_OPTIONS.plotOptions.column,
                },
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories,
            },
            yAxis: Chart.DEFAULT_OPTIONS.yAxis,
            series,
        };
    };

    getSeries() {
        return [{
            name: ls('DASHBOARD_CHART_KI_SERIES_DURATION', 'Длительность'),
            data: this.props.data.map(city => city.duration),
        }];
    }
    getCategories() {
        const categories = [];
        for (const city of this.props.data) {
            categories.push(city.name);
        }
        return categories;
    }

    render() {
        return (
            <ConnectedChart
                id="KIDuration"
                connectedTo="KICount"
                options={this.getChartOptions()}
            />
        );
    }
}

export default KIDuration;
