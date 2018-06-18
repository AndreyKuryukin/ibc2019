import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Chart from './Chart';
import rest from '../../../../rest';
import ls from '../../../../../i18n';

class DynamicKAB extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
    };

    state = {
        data: [],
    };

    componentDidMount() {
        this.fetchChartData();
    }
    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity) {
            this.fetchChartData(nextProps);
        }
    }

    getChartOptions = () => {
        const series = this.getSeries();
        const categories = this.getCategories();

        return {
            chart: {
                type: 'spline',
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_DYNAMIC_KAB_TITLE', 'Динамика Каб'),
            },
            colors: [
                '#377dc4',
                '#fc3737',
            ],
            tooltip: {
                ...Chart.DEFAULT_OPTIONS.tooltip,
                shared: true,
            },
            plotOptions: {
                spline: {
                    marker: Chart.DEFAULT_OPTIONS.plotOptions.spline.marker,
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

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
        };

        return rest.get('/api/v1/dashboard/dynamic/kab', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        const names = {
            itv1: ls('DASHBOARD_ITV', 'ИТВ'),
            itv2: ls('DASHBOARD_ITV2_0', 'ИТВ 2.0'),
        };

        return Object.entries(this.state.data).map(([key, values], i) => ({
            name: names[key],
            data: values.map(item => Number(item.kqi.toFixed(2))),
        }));
    }
    getMinMax() {
        let min = Infinity;
        let max = -Infinity;
        for (const values of Object.values(this.state.data)) {
            for (const value of values) {
                const time = (new Date(value.date_time)).getTime();
                min = Math.min(min, time);
                max = Math.max(max, time);
            }
        }
        return [min, max];
    }
    getCategories() {
        const [min, max] = this.getMinMax();

        const categories = [];
        for (let i = min; i <= max; i += 3600 * 1000) {
            const formatted = Highcharts.dateFormat('%H:00', i);
            categories.push(formatted);
        }
        return categories;
    }

    render() {
        return <Chart options={this.getChartOptions()} />;
    }
}

export default DynamicKAB;
