import React from 'react';
import Highcharts from 'highcharts';
import rest from '../../../../rest';
import KICount from './KICount';

class KI extends React.Component {
    chart = null;
    state = {
        data: null,
    };

    componentDidMount() {
        this.fetchChartData(); //.then(this.initChart);
    }
    componentWillUnmount() {
        // if (this.chart !== null) {
        //     this.chart.destroy();
        // }
    }

    initChart = () => {
        const series = this.getSeries();
        const categories = this.getCategories();

        const options = {
            chart: {
                width: this.container.offsetWidth,
            },
            title: {
                text: 'Суммарная длительность Ки МРФ Волга по РФ',
                align: 'left',
            },
            legend: {
                enabled: false,
            },
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
                // column: {
                //     pointPadding: 0,
                //     borderWidth: 0,
                // },
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

    fetchChartData() {
        return rest.get('/api/v1/dashboard/ki')
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        return [
            ...this.state.data.map(city => ({
                type: 'column',
                // name: city.name,
                name: 'Длительность',
                data: [city.duration],
            })),
            {
                type: 'spline',
                name: 'Количество',
                data: this.state.data.map(city => city.count),
                marker: {
                    enabled: true,
                    radius: 4,
                    symbol: 'circle',
                    lineColor: null,
                    lineWidth: 2,
                    fillColor: 'white',
                },
            },
        ];
    }
    getCategories() {
        const categories = [];
        for (const city of this.state.data) {
            categories.push(city.name);
        }
        return categories;
    }

    render() {
        return (
            <div>
                {this.state.data !== null && <KICount data={this.state.data} />}
            </div>
        );
    }
}

export default KI;
