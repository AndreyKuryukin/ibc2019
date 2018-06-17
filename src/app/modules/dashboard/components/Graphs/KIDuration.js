import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';

class KIDuration extends React.Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            count: PropTypes.number,
            duration: PropTypes.number,
        })).isRequired,
    };

    chart = null;

    componentDidMount() {
        this.initChart();

        const getOppositeChart = () => Highcharts.charts.find(chart => chart !== undefined && chart.options.id === 'KICount');

        this.container.addEventListener('mousemove', (e) => {
            const chart = getOppositeChart();

            if (chart !== undefined) {
                const event = chart.pointer.normalize(e);
                const point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.onMouseOver();
                    point.series.chart.xAxis[0].drawCrosshair(
                        point.series.chart.pointer.normalize(event),
                        point
                    );
                }
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.destroyChart();
            this.initChart(nextProps);
        }
    }

    initChart(props = this.props) {
        const series = this.getSeries(props);
        const categories = this.getCategories(props);

        const options = {
            id: 'KIDuration',
            chart: {
                type: 'column',
                width: this.container.offsetWidth,
            },
            title: {
                text: '',
            },
            colors: [
                '#377dc4',
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
            legend: {
                enabled: false,
            },
            plotOptions: {
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0,
                    },
                },
            },
            xAxis: {
                categories,
                crosshair: {
                    color: 'rgba(240, 240, 240, 0.7)',
                },
                lineWidth: 0,
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
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options
        );
    };
    destroyChart() {
        this.chart.destroy();
        this.chart = null;
    }

    getSeries(props) {
        return [{
            name: 'Длительность',
            data: props.data.map(city => city.duration),
        }];
    }
    getCategories(props) {
        const categories = [];
        for (const city of props.data) {
            categories.push(city.name);
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

export default KIDuration;
