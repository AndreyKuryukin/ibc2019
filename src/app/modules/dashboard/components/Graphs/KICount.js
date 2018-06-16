import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';

class KICount extends React.Component {
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
    }
    componentWillUnmount() {
        this.chart.destroy();
        this.chart = null;
    }

    initChart = () => {
        const series = this.getSeries();
        const categories = this.getCategories();

        const options = {
            chart: {
                type: 'spline',
                width: this.container.offsetWidth,
            },
            title: {
                text: 'Суммарная длительность Ки МРФ Волга по РФ',
                align: 'left',
            },
            colors: [
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
        };

        console.log(options);

        this.chart = new Highcharts.Chart(
            this.container,
            options
        );
    };

    getSeries() {
        return [{
            name: 'Количество',
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
            <div
                ref={container => this.container = container}
                style={{ width: '100%' }}
            />
        );
    }
}

export default KICount;
