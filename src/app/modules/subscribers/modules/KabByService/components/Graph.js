import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Highcharts from 'highcharts';
import styles from './styles.scss';
import { convertUTC0ToLocal } from "../../../../../util/date";
import moment from "moment";

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
        periodUnit: PropTypes.string,
    };

    static defaultProps = {
        data: [],
        periodUnit: 'HOUR'
    };

    constructor(props) {
        super(props);

        this.hiddenSeries = {};
        this.chart = null;
    }

    componentDidMount() {
        if (this.props.data.length > 0) {
            this.initChart(this.props);
        }

    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.data !== this.props.data) && nextProps.data.length > 0) {
            this.initChart(this.props);
        }
    }

    tooltipFormatter() {
        return `
            <span style="font-size: 11px">${moment(this.x).format('DD.MM.YYYY HH:mm:ss')}</span><br>
            ${this.points.reduce((str, point) =>
            str + `<span style="color:${point.color}">\u25CF</span>${point.series.name}: <b>${point.y}%</b><br/>`,
            '')}   
        `;
    }

    initChart = (props = this.props) => {
        const instance = this;
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
                enabled: !!props.data.length,
                align: 'center',
                verticalAlign: 'top'
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
                // series: {
                //     events: {
                //         hide: function () {
                //             instance.hiddenSeries[this.options.key] = true;
                //         },
                //         show: function () {
                //             instance.hiddenSeries[this.options.key] = false;
                //         },
                //     },
                // },
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
                // labels: {
                //     formatter: this.xLabelFormatter,
                // },
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
            exporting: { enabled: false },
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options,
        );
    };

    mapKqiName = (kqi) => {
        const namesMap = {
            channel_switching_time: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_SWITCH', 'Switch'),
            common: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_COMMON', 'Общий'),
            epg: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_EPG', 'EPG'),
            pvr: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_PVR', 'PVR'),
            vod: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_VOD', 'VOD'),
            broadband_access: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_LIVE', 'Live'),
            load_time: ls('SUBSCRIBERS_KAB_BY_SERVICE_KQI_LOAD', 'Load'),
        };
        return namesMap[kqi]
    };

    getSeries(data) {
        return _.reduce(data, (series, stamp) => {
            const kqis = _.without(Object.keys(stamp), 'date_time', 'id');
            kqis.forEach(kqi => {
                let line = _.find(series, elmnt => elmnt.key === kqi);
                if (!line) {
                    line = {
                        key: kqi,
                        name: this.mapKqiName(kqi),
                        data: []
                    };
                    series.push(line);
                }
                const value = Number(stamp[kqi]);
                line.data.push([convertUTC0ToLocal(stamp.date_time).valueOf(), parseFloat(value.toFixed(2))])
            });
            return series;
        }, []);
    }

    getUnit = (props) => {
        const unit = _.get(props, 'periodUnit', 'HOUR').toLowerCase();
        return unit === 'other' ? 'hour' : unit;
    };

    render() {
        return (<div>
                <div className={styles.graphTitle}>
                    <span>
                        {ls('SUBSCRIBERS_KAB_BY_SERVICE_GRAPH_TITLE', 'Динамика')}
                        {'\u00A0'}
                        {ls('KQI_INDEX', 'К')}
                        <sub>{ls('KQI_KAB_SUB', 'аб')}</sub>
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
