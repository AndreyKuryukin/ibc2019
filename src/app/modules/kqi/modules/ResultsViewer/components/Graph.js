import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as _ from "lodash";

class Graph extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        data: PropTypes.array,
    };

    static defaultProps = {
        active: false,
        data: [],
    };

    getColorForResult = (() => {
        const colorMap = {};
        return (result) => {
            const getRandomColorHex = () => {
                const hex = "0123456789ABCDEF";
                let color = "#";
                for (let i = 1; i <= 6; i++) {
                    color += hex[Math.floor(Math.random() * 16)];
                }
                return color;
            };
            if (!colorMap[result.id]) {
                colorMap[result.id] = getRandomColorHex();
            }
            return colorMap[result.id];
        }
    })();

    mapData = (historyData) => {
        // const labels = _.reduce(historyData, (labels, result) => {
        //     return labels.concat(result.values.map(value => new Date(value.date_time)));
        // }, []);

        const getRandomColorHex = () => {
            const hex = "0123456789ABCDEF";
            let color = "#";
            for (let i = 1; i <= 6; i++) {
                color += hex[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        const data = {
            datasets: historyData.map(result => {
                const label = Object.values(result).filter(value => _.isString(value)).join('_');
                const borderColor = this.getColorForResult(result);
                const data = result.values.map(value => ({ y: value.value, t: value.date_time }));
                return { label, data, borderColor, lineTension: 0 }
            })
        };
        console.log(data);
        return data;

        // return {
        //     labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
        //     datasets: [{
        //         label: "Car Speed",
        //         lineTension: 0,
        //         data: [0, 59, 75, 20, 20, 55, 40],
        //     }]
        // }
    };

    render() {
        const options = {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        max: 100,
                        steps: 10,
                        callback: (value, index, values) => {
                            return `${value}%`;
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Результат (%)'
                    },
                }],
                xAxes: [{
                    type: 'time',
                    distribution: 'series'
                }],
            }
        };
        return <Line data={this.mapData(this.props.data)} options={options}/>;
    }
}

export default Graph;
