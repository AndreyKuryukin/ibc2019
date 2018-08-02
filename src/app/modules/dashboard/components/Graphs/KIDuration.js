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
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b> ' + ls('MEASURE_UNITS_SECOND', 'сек.') + '<br/>',
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
                labels: {enabled: false},
            },
            yAxis: {
                ...Chart.DEFAULT_OPTIONS.yAxis,
                labels: {
                    style: {
                        whiteSpace: 'nowrap',
                    },
                    x: -10,
                },
            },
            series,
        };
    };

    getSeries() {
        return [{
            name: ls('DASHBOARD_CHART_KI_SERIES_DURATION', 'Длительность'),
            data: this.props.data.map(city => Math.floor(city.duration/1000)),
            dataLabels: {
                enabled: true,
                rotation: 270,
                inside: true,
                overflow: 'none',
                crop: false,
                color: '#666',
                align: 'left',
                verticalAlign: 'bottom',
                formatter: this.dataLabelsFormatter,
                style: {
                    fontWeight: '500',
                    textOutline: 0,
                },
                x: -35,
                y: -10,
                useHTML: true,
            },
        }];
    }

    getCategories() {
        const categories = [];
        for (const city of this.props.data) {
            categories.push(city.name);
        }
        return categories;
    }

    dataLabelsFormatter() {
        return this.y ? this.x : '';
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
