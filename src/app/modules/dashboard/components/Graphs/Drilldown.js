import React from 'react';
import Highcharts from 'highcharts';
import rest from '../../../../rest';

class Drilldown extends React.Component {
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

    initChart = () => {
        // const series = this.getSeries();

        this.chart = new Highcharts.Chart(
            this.container,
            {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Basic drilldown'
                },
                xAxis: {
                    type: 'category'
                },

                legend: {
                    enabled: false
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },

                series: [{
                    name: 'Things',
                    colorByPoint: true,
                    data: [{
                        name: 'Animals',
                        y: 5,
                        drilldown: 'animals'
                    }, {
                        name: 'Fruits',
                        y: 2,
                        drilldown: 'fruits'
                    }, {
                        name: 'Cars',
                        y: 4,
                        drilldown: 'cars'
                    }]
                }],
                drilldown: {
                    series: [{
                        id: 'animals',
                        data: [
                            ['Cats', 4],
                            ['Dogs', 2],
                            ['Cows', 1],
                            ['Sheep', 2],
                            ['Pigs', 1]
                        ]
                    }, {
                        id: 'fruits',
                        data: [
                            ['Apples', 4],
                            ['Oranges', 2]
                        ]
                    }, {
                        id: 'cars',
                        data: [
                            ['Toyota', 4],
                            ['Opel', 2],
                            ['Volkswagen', 2]
                        ]
                    }]
                }
            }
        );
    };

    fetchChartData() {
        return rest.get('/api/v1/dashboard/drilldown')
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        return Object.entries(this.state.data).map(([key, values]) => ({
            name: key,
            data: values.map(item => [
                (new Date(item.date_time)).getTime(),
                item.kqi,
            ]),
        }));
    }

    render() {
        return (
            <div ref={container => this.container = container}>
                Dynamic KAB
            </div>
        );
    }
}

export default Drilldown;
