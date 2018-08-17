import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import Chart from './Chart';
import ConnectedChart from './ConnectedChart';
import ls from '../../../../../i18n';

class KIDuration extends React.Component {
    static propTypes = {
        mrfId: PropTypes.string,
        regularity: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            count: PropTypes.number,
            duration: PropTypes.number,
        })).isRequired,
    };

    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    getChartOptions() {
        const series = this.getSeries();
        const categories = this.getCategories();

        return {
            owner: this,
            chart: {
                type: 'column',
                events: {
                    click: this.onClick,
                    render: function () {
                        const series = _.get(this, 'series.0.data');
                        series.forEach(item => {
                            const { dataLabel, shapeArgs } = item;

                            dataLabel.attr({
                                x: dataLabel.alignAttr.x - (10 + shapeArgs.width / 2),
                            });
                        });
                    },
                },
            },
            title: {
                text: '',
            },
            colors: [
                '#377dc4',
            ],
            tooltip: {
                ...Chart.DEFAULT_OPTIONS.tooltip,
                shared: true,
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b> ' + ls('MEASURE_UNITS_SECOND', 'сек.') + '<br/>',
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                plotOptions: {
                    column: Chart.DEFAULT_OPTIONS.plotOptions.column,
                },
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories,
                labels: { enabled: false },
            },
            yAxis: {
                ...Chart.DEFAULT_OPTIONS.yAxis,
                labels: {
                    style: {
                        whiteSpace: 'nowrap',
                    },
                    x: -10,
                },
            },
            series,
        };
    };

    getSeries() {
        return [{
            name: ls('DASHBOARD_CHART_KI_SERIES_DURATION', 'Длительность'),
            data: this.props.data.map(city => Math.floor(city.duration / 1000)),
            dataLabels: {
                enabled: true,
                rotation: 270,
                inside: true,
                overflow: 'none',
                crop: false,
                color: '#666',
                align: 'left',
                verticalAlign: 'bottom',
                formatter: this.dataLabelsFormatter,
                style: {
                    fontWeight: '500',
                    textOutline: 0,
                },
                useHTML: true,
            },
            events: {
                click: this.onClick,
            },
        }];
    }

    getCategories() {
        const categories = [];
        for (const city of this.props.data) {
            categories.push(city.name);
        }
        return categories;
    }

    onClick(e) {
        const instance = this.pointer ? this : this.chart;
        const event = instance.pointer.normalize(e);
        const point = instance.series[0].searchPoint(event, true);

        if (point) {
            const { owner } = instance.options;
            const interval = owner.props.regularity.toLowerCase();
            const start = moment().subtract(1, interval).startOf(interval).valueOf();

            owner.context.history.push({
                pathname: '/alarms/ci',
                search: _.reduce({
                    rf: owner.props.data[point.index].id,
                    mrf: owner.props.mrfId,
                    start,
                    end: moment(start).endOf(interval).valueOf(),
                    current: true,
                    historical: true,
                }, (searchString, v, k) => !searchString ? `?${k}=${v}` : searchString + `&${k}=${v}`, ''),
            });
        }
    }

    dataLabelsFormatter() {
        return this.y ? this.x : '';
    }

    render() {
        return (
            <ConnectedChart
                ref={chart => this.chart = chart}
                id="KIDuration"
                connectedTo="KICount"
                options={this.getChartOptions()}
            />
        );
    }
}

export default KIDuration;
