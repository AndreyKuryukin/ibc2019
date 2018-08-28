import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Chart from './Chart';
import moment from 'moment';
import rest from '../../../../rest';
import ls from 'i18n';
import { REGULARITIES } from '../../constants';
import { convertUTC0ToLocal } from '../../../../util/date';

const NAMES = {
    itv1: 'ИТВ',
    itv2: 'ИТВ 2.0',
};
const STEPS = {
    [REGULARITIES.HOUR]: 3600 * 1000,
    [REGULARITIES.DAY]: 24 * 3600 * 1000,
    [REGULARITIES.WEEK]: 7 * 24 * 3600 * 1000,
};

const COLORS = [
    '#377dc4',
    '#fc3737',
];

class DynamicKAB extends React.Component {
    static propTypes = {
        regularity: PropTypes.oneOf(Object.values(REGULARITIES)).isRequired,
    };

    static createPlotLineOptions(x, timestamp) {
        return {
            value: x,
            color: '#082545',
            width: 1,
            label: {
                text: moment(timestamp).format('D MMMM YYYY').toLowerCase(),
                style: {
                    color: 'rgba(0, 0, 0, 0.3)',
                    fontSize: '12px',
                },
                rotation: -90,
                verticalAlign: 'bottom',
                textAlign: 'left',
                y: -8,
                x: -8,
            },
        };
    }

    static isStartOfTheDay(timestamp) {
        return new Date(timestamp).getHours() === 0;
    }

    /*
        Expands chart data in the following way:
         * sorts points by timestamp
         * adds nully points for each skipped timestamp
     */
    static expandData(data, regularity) {
        const keys = Object.keys(data);
        const acc = new Map(); // Map<Timestamp, Map<[itv1|itv2], Array<Point>>>

        // grouping points by timestamp
        for (const [key, points] of Object.entries(data)) {
            for (const point of points) {
                const timestamp = convertUTC0ToLocal(point.date_time).valueOf();
                let points = acc.get(timestamp);
                if (points === undefined) {
                    points = new Map();
                    acc.set(timestamp, points);
                }
                points.set(key, point);
            }
        }

        let prevTimestamp;
        const step = STEPS[regularity];
        return Array.from(acc)
            .sort(([aTimestamp], [bTimestamp]) => aTimestamp - bTimestamp)
            .reduce(
                (result, [timestamp, value]) => {
                    let offset = prevTimestamp === undefined ? 0 : timestamp - prevTimestamp;

                    while (offset > step) {
                        for (const key of keys) {
                            result[key].push({
                                value: null,
                                timestamp,
                            });
                        }
                        offset -= step;
                    }

                    for (const key of keys) {
                        result[key].push({
                            value: (value.get(key) || {}).kqi || null,
                            timestamp,
                        });
                    }

                    prevTimestamp = timestamp;

                    return result;
                },
                keys.reduce((result, key) => ({
                    ...result,
                    [key]: [],
                }), {})
            );
    }

    state = {
        data: [],
    };

    componentDidMount() {
        this.fetchChartData();
    }
    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity) {
            this.fetchChartData(nextProps);
        }
    }

    chartRender() {
        const legendPoints = this.container.querySelectorAll('.highcharts-legend .highcharts-point');

        legendPoints.forEach((point) => {
            const strokeColor = point.getAttribute('stroke');
            point.setAttribute('fill', strokeColor);
        });
    }

    getPlotLines() {
        if (this.props.regularity !== REGULARITIES.HOUR) return undefined;

        const values = Object.values(this.state.data)[0];
        if (values === undefined) return undefined;

        return values
            .filter(DynamicKAB.isStartOfTheDay)
            .map((value, index) => DynamicKAB.createPlotLineOptions(index, value.timestamp));
    }

    getChartOptions = () => {
        const series = this.getSeries();
        const categories = this.getCategories();

        return {
            chart: {
                type: 'spline',
                events: {
                    render: this.chartRender,
                },
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_DYNAMIC_KAB_TITLE', 'Динамика Каб'),
            },
            legend: {
                align: 'left',
                symbolWidth: 10,
            },
            tooltip: {
                ...Chart.DEFAULT_OPTIONS.tooltip,
                shared: true,
                formatter: function() {
                    if (this.points.length === 0) return undefined;

                    const date = moment(this.points[0].point.timestamp).format('D MMMM YYYY').toLowerCase();
                    const points = this.points
                        .map(point => `${point.series.name}: <span style="color: ${point.series.color}">${point.y}%</span>`)
                        .join('<br />');

                    return `
                        ${date}<br />
                        ${points}
                    `;
                },
            },
            plotOptions: {
                spline: {
                    marker: Chart.DEFAULT_OPTIONS.plotOptions.spline.marker,
                },
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories,
                plotLines: this.getPlotLines(),
            },
            yAxis: Chart.DEFAULT_OPTIONS.yAxis,
            series,
        };
    };

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
        };

        return rest.get('/api/v1/dashboard/dynamic/kab', {}, { queryParams })
            .then(({ data }) => this.setState({
                data: DynamicKAB.expandData(data, props.regularity),
            }))
            .catch(console.error);
    }

    getSeries() {
        return Object.entries(this.state.data).map(([key, values], i) => ({
            name: ls(`DASHBOARD_${key.toUpperCase()}`, NAMES[key]),
            data: values.map((item, x) => ({
                x,
                y: typeof item.value !== 'number' ? null : Number(item.value.toFixed(2)),
                timestamp: item.timestamp,
            })),
            color: COLORS[i],
            marker: {
                states: {
                    hover: {
                        fillColor: COLORS[i],
                    },
                },
            }
        }));
    }
    getCategories() {
        const { regularity } = this.props;
        const values = Object.values(this.state.data)[0];

        if (values === undefined || values.length === 0) return [];

        const step = STEPS[regularity];
        const minTime = values[0].timestamp;
        const maxTime = values[values.length - 1].timestamp;
        const categories = [];

        const formatPattern = regularity === REGULARITIES.HOUR ? 'HH:00' : 'D.MM.YYYY';

        for (let time = minTime; time <= maxTime; time += step) {
            const formatted = moment(time).format(formatPattern);
            categories.push(formatted);
        }

        return categories;
    }

    render() {
        return <Chart options={this.getChartOptions()} />;
    }
}

export default DynamicKAB;
