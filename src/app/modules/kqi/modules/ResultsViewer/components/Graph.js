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
            const id = Object.values(result).map(value => _.isArray(value) ? value.length : value).join('_');
            if (!colorMap[id]) {
                colorMap[id] = getRandomColorHex();
            }
            return colorMap[id];
        }
    })();

    mapData = (historyData) => {

        const data = {
            datasets: historyData.map(result => {
                const label = Object.values(result).filter(value => _.isString(value)).join('_');
                const borderColor = this.getColorForResult(result);
                const data = result.values.map(value => ({ y: value.value * 100, t: value.date_time }));
                return { label, data, borderColor, lineTension: 0 }
            })
        };
        return data;
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
