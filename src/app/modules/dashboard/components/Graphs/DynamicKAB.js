import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import rest from '../../../../rest';
import ls from '../../../../../i18n';

class DynamicKAB extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
    };

    chart = null;
    state = {
        data: {},
    };

    componentDidMount() {
        this.fetchChartData().then(this.initChart);
    }
    componentWillUnmount() {
        if (this.chart !== null) {
            this.chart.destroy();
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity) {
            if (this.chart !== null) {
                this.chart.destroy();
            }
            this.fetchChartData(nextProps).then(this.initChart);
        }
    }

    initChart = () => {
        const series = this.getSeries();
        const categories = this.getCategories();

        this.chart = new Highcharts.Chart(
            this.container,
            {
                chart: {
                    type: 'spline',
                    width: this.container.offsetWidth,
                },
                title: {
                    text: ls('DASHBOARD_CHART_DYNAMIC_KAB_TITLE', 'Динамика Каб'),
                    style: {
                        color: '#02486e',
                        fontSize: 18,
                    },
                    align: 'left',
                },
                colors: [
                    '#377dc4',
                    '#fc3737',
                ],
                tooltip: {
                    shared: true,
                    backgroundColor: '#082545',
                    borderRadius: 7,
                    borderWidth: 0,
                    style: {
                        color: 'white',
                    },
                    useHTML: true,
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true,
                            radius: 4,
                            symbol: 'circle',
                            lineColor: null,
                            lineWidth: 2,
                            fillColor: 'white',
                        },
                    },
                },
                xAxis: {
                    categories,
                    crosshair: {
                        color: 'rgba(240, 240, 240, 0.7)',
                    },
                    lineWidth: 1,
                    lineColor: 'rgba(0, 0, 0, 0.2)',
                    gridLineWidth: 1,
                    gridLineColor: 'rgba(0, 0, 0, 0.05)',
                    tickWidth: 0,
                    labelColor: 'rgba(0, 0, 0, 0.5)',
                },
                yAxis: {
                    title: {
                        text: '%',
                        align: 'high',
                        offset: 0,
                        rotation: 0,
                        y: -10,
                        color: 'rgba(0, 0, 0, 0.5)',
                    },
                    gridLineWidth: 0,
                    lineWidth: 1,
                    lineColor: 'rgba(0, 0, 0, 0.2)',
                    labelColor: 'rgba(0, 0, 0, 0.5)',
                },
                series,
            }
        );
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
        return (
            <div
                ref={container => this.container = container}
                style={{ width: '100%' }}
            />
        );
    }
}

export default DynamicKAB;
