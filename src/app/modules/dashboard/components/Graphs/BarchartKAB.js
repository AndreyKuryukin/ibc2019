import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';
import rest from '../../../../rest';
import ls from '../../../../../i18n';
import {MACRO_RF_ID} from '../../constants';

class BarchartKAB extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
    };

    state = {
        data: [],
    };

    componentDidMount() {
        this.fetchChartData()
    }
    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            this.fetchChartData(nextProps);
        }
    }

    getChartOptions = () => {
        return {
            chart: {
                type: 'column',
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_BARCHART_KAB_TITLE', 'Каб ИТВ МРФ Волга в проекции по региональным филиалам'),
            },
            tooltip: {
                ...Chart.DEFAULT_OPTIONS.tooltip,
                shared: true,
                formatter: function() {
                    const {x, points} = this;

                    if (points.length === 0) return '';
                    const {currentColor, previous, current} = points[0].point.options;

                    return `
                        ${x}<br />
                        ${ls('PREVIOUS', 'Предыдущий')}: ${previous}%<br />
                        ${ls('CURRENT', 'Текущий')}: <span style="color: ${currentColor}">${current}%</span><br />
                    `;
                },
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories: this.getCategories(),
            },
            yAxis: {
                ...Chart.DEFAULT_OPTIONS.yAxis,
                max: 100,
                min: this.getMin(),
            },
            plotOptions: {
                column: Chart.DEFAULT_OPTIONS.plotOptions.column,
            },
            series: this.getSeries(),
        };
    };

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };
        if (queryParams.mrf === MACRO_RF_ID) {
            delete queryParams.mrf;
        }

        return rest.get('/api/v1/dashboard/barchart/kab', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        const previousColor = '#082545';
        const normalColor = '#7cc032';
        const criticalColor = '#fc3737';

        const previousName = ls('DASHBOARD_CHART_BARCHART_KAB_LEGEND_PREVIOUS', 'Предыдущий период');
        const normalName = ls('DASHBOARD_CHART_BARCHART_KAB_LEGEND_NORMAL', 'Текущий период лучше предыдущего');
        const criticalName = ls('DASHBOARD_CHART_BARCHART_KAB_LEGEND_CRITICAL', 'Текущий период хуже предыдущего');

        const cut = number => typeof number === 'number'
            ? parseFloat(number.toFixed(2))
            : 'N/A';

        const previousData = this.state.data.map(item => ({
            y: item.previous,
            currentColor: item.current >= item.previous ? normalColor : criticalColor,
            previous: cut(item.previous),
            current: cut(item.current),
        }));
        const normalData = this.state.data.map(item => ({
            y: item.current,
            color: item.current >= item.previous ? normalColor : criticalColor,
            currentColor: item.current >= item.previous ? normalColor : criticalColor,
            previous: cut(item.previous),
            current: cut(item.current),
        }));

        return [
            {
                name: previousName,
                data: previousData,
                color: previousColor,
            }, {
                name: normalName,
                data: normalData,
                color: normalColor,
            }, {
                name: criticalName,
                color: criticalColor,
            },
        ];
    }
    getCategories() {
        return this.state.data.map(item => item.name);
    }
    getMin() {
        const min = Math.min(...this.state.data.reduce((acc, item) => [...acc, item.current, item.previous], []));

        return Math.max(0, min - (100 - min) * 0.1);
    }

    render() {
        return <Chart options={this.getChartOptions()} />;
    }
}

export default BarchartKAB;
