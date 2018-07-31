import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import {debounce, isEqual} from 'lodash';

class Chart extends React.PureComponent {
    static propTypes = {
        options: PropTypes.shape({
            chart: PropTypes.object.isRequired,
        }).isRequired,
    };
    static DEFAULT_OPTIONS = {
        title: {
            style: {
                color: '#02486e',
                fontSize: '18px',
            },
            align: 'left',
        },
        tooltip: {
            backgroundColor: '#082545',
            borderRadius: 7,
            borderWidth: 0,
            style: {
                color: 'white',
            },
            useHTML: true,
            shadow: false,
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
            column: {
                pointPadding: 0,
                borderWidth: 0,
            },
            pie: {
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
                center: ['50%', '50%'],
            },
        },
        xAxis: {
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
    };

    chart = null;

    componentDidMount() {
        this.initChart();

        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        this.destroyChart();
        window.removeEventListener('resize', this.onResize);
    }
    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options)) {
            this.reinitChart(nextProps);
        }
    }

    onResize = debounce(() => {
        if (this.chart !== null) {
            this.chart.setSize(this.container.offsetWidth);
        }
    }, 50);

    initChart = (props = this.props) => {
        const { options } = props;

        const width = options.chart.width !== undefined
            ? options.chart.width
            : this.container.offsetWidth;

        this.chart = new Highcharts.Chart(
            this.container,
            {
                ...options,
                chart: {
                    ...options.chart,
                    width,
                },
            }
        );
    };
    destroyChart() {
        if (this.chart !== null) {
            this.chart.destroy();
            this.chart = null;
        }
    }
    reinitChart(props) {
        this.destroyChart();
        this.initChart(props);
    }
    getChart = () => this.chart;

    render() {
        return (
            <div
                ref={container => this.container = container}
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    flexShrink: 1,
                    flexGrow: 1,
                    flexBasis: '100%',
                }}
            />
        );
    }
}

export default Chart;
