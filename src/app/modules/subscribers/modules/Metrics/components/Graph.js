import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Highcharts from 'highcharts';
import styles from './styles.scss';
import { convertUTC0ToLocal } from "../../../../../util/date";
import moment from "moment";
import { getMetricsTranslation } from './MetricsGrid';

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
        data: PropTypes.array,
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
        const metric = _.get(props.data, '0');
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
                enabled: true,
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
                    text: (_.get(metric, 'type') === 'int' || _.get(metric, 'type') === 'double')
                        ? _.get(metric, 'unit', ls('SUBSCRIBERS_METRICS_GRAPH_Y_AXIS_TITLE', 'Единицы'))
                        : ls('SUBSCRIBERS_METRICS_GRAPH_Y_AXIS_TITLE', 'Единицы'),
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

    xLabelFormatter() {
        return moment(this.value).format('HH:mm:ss');
    }
// [convertUTC0ToLocal(time).valueOf(), parseFloat(values[xKey])]
    mapAndSortData = (data, xKey) =>
        data.map(values => ({
            x: convertUTC0ToLocal(values.time).valueOf(),
            y: parseFloat(values[xKey]),
            stringY: values[xKey],
            type: values.type,
            dict_content_translation_keys: values.dict_content_translation_keys,
            unit: values.unit,
        })).sort((point1, point2) => point1.x - point2.x);

    getSeries(data, key) {
        return [{
            key: key,
            name: ls('SUBSCRIBERS_METRICS_AVERAGE_SERIES_NAME', 'Среднее значение'),
            data: this.mapAndSortData(data, 'avg'),
        }, {
            key: key,
            name: ls('SUBSCRIBERS_METRICS_MIN_SERIES_NAME', 'Минимальное значение'),
            data: this.mapAndSortData(data, 'min'),
        }, {
            key: key,
            name: ls('SUBSCRIBERS_METRICS_AVERAGE_MAX_NAME', 'Максимальное значение'),
            data: this.mapAndSortData(data, 'max'),
        }];
    }

    getUnit = (props) => {
        const unit = _.get(props, 'periodUnit', 'HOUR').toLowerCase();
        return unit === 'other' ? 'hour' : unit;
    };

    tooltipFormatter() {
        return `
            <span style="font-size: 11px">${moment(this.x).format('DD.MM.YYYY HH:mm:ss')}</span><br>
            ${this.points.reduce((str, point) => {
                const { point: pointInfo } = point;
                const { dict_content_translation_keys, type, unit, stringY } = pointInfo;
                
                let title = '';
                
                if (type === 'int' || type === 'double' || type === null) {
                    title = stringY; 
                } else {
                    title = getMetricsTranslation(_.get(dict_content_translation_keys, point.y, point.y));
                }
                
                return str + `<span style="color:${point.color}">\u25CF</span>${point.series.name}: <b>${title}</b><br/>`;
            }, '')}   
        `;
    }

    getPeriodTitle = (periodUnit) => {
        return {
            'HOUR': ls('HOUR', 'Час'),
            'DAY': ls('DAY', 'День'),
            'WEEK': ls('WEEK', 'Неделя'),
        }[periodUnit]
    };

    render() {
        const { data } = this.props;
        const legendDict = _.get(data, '0.dict_content_translation_keys');
        return (
            <div className={styles.subscriberMetricsResultsViewer}>
                <div className={styles.graphMetricsHeader}>
                    <span className={styles.graphMetricsTitle}>{ls('SUBSCRIBERS_METRICS_GRAPH_TITLE', 'Динамика изменений')}</span>
                    {legendDict && (
                        <div className={styles.graphMetricsLegend}>
                            {Object.keys(legendDict).map(key => (
                                <span key={key}>{`${key} — ${getMetricsTranslation(_.get(legendDict, key, key))}`}</span>
                            ))}
                        </div>
                    )}
                    {/*<span>{ls('SUBSCRIBERS_METRICS_GRAPH_PARAM_TITLE', 'Параметр: ')}</span>*/}
                    {/*<span>{this.props.id}</span>*/}
                    {/*<span>{ls('SUBSCRIBERS_METRICS_GRAPH_PERIOD_TITLE', 'Период: ')}</span>*/}
                    {/*<span>{this.getPeriodTitle(this.props.periodUnit)}</span>*/}
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
