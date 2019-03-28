import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Highcharts from 'highcharts';
import styles from './device-details.scss';
import { convertUTC0ToLocal } from "../../../../../util/date";
import moment from "moment";

// const highchartsMore = require('highcharts/highcharts-more');
// highchartsMore(Highcharts);

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
        data: PropTypes.object,
        periodUnit: PropTypes.string,
        id: PropTypes.string
    };

    static defaultProps = {
        periodUnit: 'HOUR'
    };

    constructor(props) {
        super(props);

        this.hiddenSeries = {};
        this.chart = null;
    }

    componentDidMount() {
        if (this.props.data) {
            this.initChart(this.props);
        }

    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.data !== this.props.data)) {
            this.initChart(this.props);
        }
    }

    initChart = (props = this.props) => {
        const options = {
            dateTimeUnit: this.getUnit(props),
            credits: { enabled: false },
            chart: {
                type: 'spline',
                height: this.container.offsetHeight,
                width: this.container.offsetWidth,
            },
            title: {
                text: '',
            },
            legend: {
                enabled: false,
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
                    text: 'Total (%)',
                },
                gridLineWidth: 0,
                lineWidth: 1,
                lineColor: 'rgba(0, 0, 0, 0.2)',
                labelColor: 'rgba(0, 0, 0, 0.5)',
            },
            series: this.getSeries(props.data, props.id),
            exporting: { enabled: false },
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options,
        );
    };

    tooltipFormatter() {
        return `
            <span style="font-size: 11px">${moment(this.x).format('DD.MM.YYYY HH:mm:ss')}</span><br>
            ${this.points.reduce((str, point) =>
            str + `<span style="color:${point.color}">\u25CF</span>${point.series.name}: <b>${point.y}%</b><br/>`,
            '')}   
        `;
    }

    getSeries(data, key) {
        return [{
            key: key,
            name: 'Total (%)',
            data: _.reduce(data, (series, value) => {
                const { date_time, common } = value;
                if (_.isNumber(common)) {
                    series.push([convertUTC0ToLocal(date_time).valueOf(), parseFloat(common.toFixed(2))]);
                }
                return series;
            }, []).sort((point1, point2) => point1[0] - point2[0])
        }];
    }

    getUnit = (props) => {
        const unit = _.get(props, 'periodUnit', 'HOUR').toLowerCase();
        return unit === 'other' ? 'hour' : unit;
    };

    getPeriodTitle = (periodUnit) => {
        return {
            'HOUR': ls('HOUR', 'Час'),
            'DAY': ls('DAY', 'День'),
            'WEEK': ls('WEEK', 'Неделя'),
        }[periodUnit]
    };

    render() {
        return (
            <div className={styles.subscriberDevicesResultsViewer}>
                <div className={styles.graphTitle}>
                    <span>
                        {'KQI'}
                        <sub>sub</sub>
                        {'\u00A0'}
                        {'History'}
                    </span>
                </div>
                <div
                    ref={container => this.container = container}
                    className={styles.kqiResultsViewerGraphContainer}
                />
            </div>
        );
    }
}

export default Graph;
