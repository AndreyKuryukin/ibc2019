import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';
import ConnectedChart from './ConnectedChart';
import ls from '../../../../../i18n';

class KICount extends React.Component {
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
            id: 'KICount',
            chart: {
                type: 'spline',
                height: 162,
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_KI_TITLE', 'Статистика КИ МРФ Волга в проекции по региональным филиалам'),
            },
            colors: [
                '#fc3737',
            ],
            tooltip: Chart.DEFAULT_OPTIONS.tooltip,
            legend: {
                enabled: false,
            },
            plotOptions: {
                spline: {
                    marker: Chart.DEFAULT_OPTIONS.plotOptions.spline.marker,
                },
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories,
                labels: {
                    enabled: false,
                },
                lineWidth: 0,
            },
            yAxis: {
                ...Chart.DEFAULT_OPTIONS.yAxis,
                min: 0,
                max: 100,
            },
            series,
        };
    };

    getSeries() {
        return [{
            name: ls('DASHBOARD_CHART_KI_SERIES_COUNT', 'Количество'),
            data: this.props.data.map(city => city.count),
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
                id="KICount"
                connectedTo="KIDuration"
                options={this.getChartOptions()}
            />
        );
    }
}

export default KICount;
