import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as _ from "lodash";
import moment from "moment";
import { DATE_TIME } from "../../../../../costants/date";

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

    mapData = (historyData) => {
        const labels = _.reduce(historyData, (labels, result) => {
            return labels.concat(result.values.map(value => moment(value.date_time).format(DATE_TIME)));
        }, []);
        const data = {
            labels,
            datasets: historyData.map(result => {
                const label = Object.values(result).filter(value => _.isString(value)).join('_');
                // const labels = result.values.map(value => moment(value.date_time).format(DATE_TIME));
                const borderColor = [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ];
                const data = result.values.map(value => value.value);
                return { label, data, borderColor, lineTension: 0 }
            })
        };
        console.log(data, historyData);
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
                        beginAtZero: true,
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
                }]
            }
        };
        return <Line data={this.mapData(this.props.data)} options={options}/>;
    }
}

export default Graph;
