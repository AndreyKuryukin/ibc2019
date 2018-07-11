import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Highcharts from 'highcharts';
import moment from 'moment';
import { DATE_TIME } from '../../../../../costants/date';
import styles from './styles';

const DISPLAY_FORMATS = {
    'millisecond': 'HH:mm:ss',
    'second': 'HH:mm:ss',
    'minute': 'HH:mm',
    'hour': 'DD.MM HH:mm',
    'day': 'DD.MM HH:mm',
    'week': 'DD MMM',
    'month': 'DD MMM',
    'quarter': 'DD MMM',
    'year': 'DD.MM.YYYY',
};

class Graph extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        projection: PropTypes.object,
        locations: PropTypes.array,
    };

    static defaultProps = {
        data: [],
        projection: {},
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

        this.chart = null;
    }

    componentDidMount() {
        this.initChart();
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
        if (this.props.data !== nextProps.data) {
            this.initChart(nextProps);
        }
    }

    initChart = (props = this.props) => {
        const options = {
            dateTimeUnit: this.getUnit(props.projection),
            chart: {
                type: 'spline',
                height: this.container.offsetHeight,
                width: this.container.offsetWidth,
            },
            title: {
                text: '',
            },
            legend: {
                enabled: !!props.data.length,
            },
            tooltip: {
                backgroundColor: '#082545',
                borderRadius: 7,
                borderWidth: 0,
                style: {
                    color: 'white',
                },
                useHTML: true,
                shared: true,
                formatter: this.tooltipFormatter,
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
                type: 'datetime',
                crosshair: true,
                lineWidth: 1,
                lineColor: 'rgba(0, 0, 0, 0.2)',
                gridLineWidth: 1,
                gridLineColor: 'rgba(0, 0, 0, 0.05)',
                tickWidth: 0,
                labelColor: 'rgba(0, 0, 0, 0.5)',
                labels: {
                    formatter: this.xLabelFormatter,
                },
            },
            yAxis: {
                title: {
                    text: ls('KQI_PROJECTION_RESULT_TITLE', 'Результат') + ' (%)',
                },
                gridLineWidth: 0,
                lineWidth: 1,
                lineColor: 'rgba(0, 0, 0, 0.2)',
                labelColor: 'rgba(0, 0, 0, 0.5)',
            },
            series: this.getSeries(props.data),
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options,
        );
    };

    xLabelFormatter() {
        const unit = this.chart.options.dateTimeUnit;

        return moment(this.value).format(DISPLAY_FORMATS[unit]);
    }

    tooltipFormatter() {
        return `
            <span style="font-size: 11px">${moment(this.x).format('DD.MM.YYYY HH:mm:ss')}</span><br>
            ${this.points.reduce((str, point) => 
                str + `<span style="color:${point.color}">\u25CF</span>${point.series.name}: <b>${point.y}%</b><br/>`,
            '')}   
        `;
    }

    getSeries(historyData) {
        return historyData.length ? historyData.map(result => ({
            name: this.composeGraphLabel(result),
            data: result.values
                .map(value => [moment(value.date_time).valueOf(), parseFloat(value.value.toFixed(2))])
                .sort(([timeA], [timeB]) => timeA - timeB),
        })) : [{ data: [] }];
    }

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

    getUnit = (projection) => {
        const unit = _.get(projection, 'period.regularity', 'HOUR').toLowerCase();
        return unit === 'other' ? 'hour' : unit;
    };

    render() {
        return (
            <div
                ref={container => this.container = container}
                className={styles.kqiResultsViewerGraphContainer}
            />
        );
    }
}

export default Graph;
