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
        locations: PropTypes.array,
    };

    static defaultProps = {
        active: false,
        data: [],
        locations: [],
    };

    constructor(props) {
        super(props);
        const locationmap = this.mapLocations(props.locations);
        this.state = {
            valueMap: {
                rf: locationmap,
                mrf: locationmap
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.locations, this.props.locations)) {
            const locationmap = this.mapLocations(nextProps.locations);
            this.setState({
                valueMap: {
                    rf: locationmap,
                    mrf: locationmap
                }
            });
        }
    }

    getColorForResult = (() => {
        const colorMap = {};
        return (result, index) => {
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

    getMapedValueWithDefault = (fieldName, value) => {
        return _.get(this.state.valueMap, `${fieldName}.${value}`, value);
    };

    mapLocations = (locations) => _.reduce(locations, (result, location) => {
        result[location.id] = location.name;
        return result;
    }, {});

    composeGraphLabel = (result) => _.reduce(_.omit(result, 'id'), (parts, value, key) => {
        const part = this.getMapedValueWithDefault(key, value);
        if (!_.isEmpty(part) && !_.isObject(part)) {
            parts.push(part)
        }
        return parts
    }, []).join('_');

    mapData = (historyData) => {

        const data = {
            datasets: historyData.map((result, index) => {
                const label = this.composeGraphLabel(result);
                const borderColor = this.getColorForResult(result,index);
                const data = result.values
                    .map(value => ({ y: (value.value * 100).toFixed(2), t: value.date_time }))
                    .sort((a,b) => new Date(a.t).getTime() - new Date(b.t).getTime());
                return { label, data, borderColor, lineTension: 0 }
            })
        };
        return data;
    };

    render() {
        const data = this.mapData(this.props.data);
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
                    distribution: 'series',
                    time: {
                        displayFormats: {
                            millisecond: 'h:mm:ss a'
                        }
                    }
                }],
            }
        };
        return <Line data={data} options={options}/>;
    }
}

export default Graph;
