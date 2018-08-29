import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import Chart from './Chart';
import ConnectedChart from './ConnectedChart';
import ls from '../../../../../i18n';

class KICount extends React.Component {
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
            id: 'KICount',
            owner: this,
            chart: {
                type: 'spline',
                height: 162,
                events: {
                    click: this.onClick,
                },
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_KI_TITLE', 'Статистика КИ МРФ Волга в проекции по региональным филиалам'),
            },
            tooltip: Chart.DEFAULT_OPTIONS.tooltip,
            legend: {
                enabled: false,
            },
            plotOptions: {
                spline: {
                    marker: Chart.DEFAULT_OPTIONS.plotOptions.spline.marker,
                },
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories,
                labels: {
                    enabled: false,
                },
                lineWidth: 0,
            },
            yAxis: {
                ...Chart.DEFAULT_OPTIONS.yAxis,
                title: {
                    text: '',
                },
            },
            series,
        };
    };

    getSeries() {
        return [{
            name: ls('DASHBOARD_CHART_KI_SERIES_COUNT', 'Количество'),
            data: this.props.data.map(city => city.count),
            color: '#fc3737',
            marker: {
                states: {
                    hover: {
                        fillColor: '#fc3737',
                    },
                },
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
                pathname: '/alerts/ci',
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

    render() {
        return (
            <ConnectedChart
                id="KICount"
                connectedTo="KIDuration"
                options={this.getChartOptions()}
            />
        );
    }
}

export default KICount;
