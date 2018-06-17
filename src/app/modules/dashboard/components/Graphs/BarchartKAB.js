import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import rest from '../../../../rest';

class Drilldown extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
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
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            if (this.chart !== null) {
                this.chart.destroy();
            }
            this.fetchChartData(nextProps).then(this.initChart);
        }
    }

    initChart = () => {
        this.chart = new Highcharts.Chart(
            this.container,
            {
                chart: {
                    type: 'column',
                    width: this.container.offsetWidth,
                },
                title: {
                    text: 'Каб по РФ',
                    style: {
                        color: '#02486e',
                        fontSize: 18,
                    },
                    align: 'left',
                },
                xAxis: {
                    categories: this.getCategories(),
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
                    max: 100,
                    min: this.getMin(),
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
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0,
                    },
                },
                colors: [
                    '#082545',
                    '#7cc032',
                    '#fc3737',
                ],
                series: this.getSeries(),
            }
        );
    };

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };

        return rest.get('/api/v1/dashboard/barchart/kab', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        const previous = this.state.data.map(item => item.previous);

        return [
            {
                name: 'Предыдущий',
                data: previous,
            }, {
                name: 'Нормальный',
                data: this.state.data.map((item, i) => ({
                    y: item.current,
                    color: item.current >= previous[i] ? '#7cc032' : '#fc3737',
                })),
            }, {
                name: 'Критический',
                color: '#fc3737',
            },
        ];
    }
    getCategories() {
        return this.state.data.map(item => item.name);
    }
    getMin() {
        const min = Math.min(...this.state.data.reduce((acc, item) => [...acc, item.current, item.previous], []));

        return Math.max(0, min - (100 - min) * 0.1);
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

export default Drilldown;
