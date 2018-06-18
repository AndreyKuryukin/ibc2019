import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import rest from '../../../../rest';
import ls from '../../../../../i18n';

Drilldown(Highcharts);

const colors = {
    FTTB: 'rgb(124, 192, 50)', //#7cc032',
    GPON: 'rgb(55, 125, 196)', //#377dc4',
    XDSL: 'rgb(253, 127, 0)', //#fd7f00',
    FTTB_broken: 'rgba(124, 192, 50, 0.6)',
    GPON_broken: 'rgba(55, 125, 196, 0.6)',
    XDSL_broken: 'rgba(253, 127, 0, 0.6)',
};

class Amount extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
    };

    chart = null;
    state = {
        data: {},
    };

    componentDidMount() {
        this.fetchChartData().then(this.initChart);
    }
    componentWillUnmount() {
        if (this.chart !== null) {
            this.chart.destroy();
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            if (this.chart !== null) {
                this.chart.destroy();
            }
            this.fetchChartData(nextProps).then(this.initChart);
        }
    }

    initChart = () => {
        const instance = this;

        const hoverTextOptions = [
            {
                getter: data => data.name,
                offset: -67,
                fill: '#02486e',
                size: 14,
            }, {
                getter: data => data.totalPart + '%',
                offset: -35,
                fill: '#7cc032',
                size: 34,
            }, {
                getter: () => ls('DASHBOARD_CHART_AMOUNT_LABEL_BROKEN', 'Аварийные'),
                offset: -12,
                fill: '#02486e',
                size: 14,
            }, {
                getter: data => data.broken + '%',
                offset: 22,
                fill: '#e43f3f',
                size: 34,
            }
        ];

        const options = {
            chart: {
                type: 'pie',
                width: this.container.offsetWidth,
            },
            title: {
                text: ls('DASHBOARD_CHART_AMOUNT_TITLE', 'Количество STB ИТВ МРФ Волга'),
                style: {
                    color: '#02486e',
                    fontSize: 18,
                },
                align: 'left',
            },
            tooltip: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    center: ['50%', '50%'],
                },
                series: {
                    point: {
                        events: {
                            mouseOver: function() {
                                const { renderer, chartWidth, chartHeight } = instance.chart;
                                const { hoverData } = this;

                                const cx = chartWidth / 2;
                                const cy = chartHeight / 2;

                                instance.texts = hoverTextOptions.map(options => renderer.text(
                                    options.getter(hoverData),
                                    cx,
                                    cy + options.offset,
                                ).attr({
                                    fill: options.fill,
                                    'font-size': options.size,
                                    align: 'center',
                                }).add());
                            },
                            mouseOut: function() {
                                if (Array.isArray(instance.texts)) {
                                    instance.texts.forEach(text => text.destroy());
                                    delete instance.texts;
                                }
                            },
                        },
                    },
                },
            },
            series: [{
                name: 'Amount',
                colorByPoint: true,
                size: '100%',
                innerSize: '80%',
                data: this.getSeries(),
            }],
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options
        );
    };

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };

        return rest.get('/api/v1/dashboard/abonents', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        const sum = Object.values(this.state.data).reduce((result, item) => result + item.total, 0);

        return Object.entries(this.state.data).reduce((result, [key, { total, broken }], i, ar) => {
            const hoverData = {
                name: key,
                totalPart: parseFloat((total / sum).toFixed(2)),
                broken: parseFloat((broken / total).toFixed(2)),
            };

            result.push({
                name: key,
                y: total,
                color: colors[key],
                hoverData,
            });
            result.push({
                name: `${ls('DASHBOARD_CHART_AMOUNT_LABEL_BROKEN', 'Аварийные')} ${key}`,
                y: total,
                color: colors[`${key}_broken`],
                legendIndex: i + ar.length,
                hoverData,
            });
            return result;
        }, []);
    }

    render() {
        return (
            <div
                ref={container => this.container = container}
                style={{ width: '100%' }}
            />
        );
    }
}

export default Amount;
