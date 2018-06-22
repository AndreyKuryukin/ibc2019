import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import PatternFill from 'highcharts/modules/pattern-fill';
import Chart from './Chart';
import rest from '../../../../rest';
import ls from '../../../../../i18n';
import {MACRO_RF_ID} from '../../constants';

PatternFill(Highcharts);


const colors = {
    FTTB: '#7cc032',
    GPON: '#377dc4',
    XDSL: '#fd7f00',
};

class Amount extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
    };

    state = {
        data: {},
        sum: {
            total: 'N/A',
            broken: 'N/A',
        },
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
        const hoverTextOptions = [
            {
                getter: data => data.name,
                offset: -67,
                fill: '#02486e',
                size: 14,
            }, {
                getter: data => data.totalPart,
                offset: -35,
                fill: '#7cc032',
                size: 34,
            }, {
                getter: () => ls('DASHBOARD_CHART_AMOUNT_LABEL_BROKEN', 'Аварийные'),
                offset: -12,
                fill: '#02486e',
                size: 14,
            }, {
                getter: data => data.broken,
                offset: 22,
                fill: '#e43f3f',
                size: 34,
            }
        ];

        const {sum} = this.state;
        const totalData = {
            name: ls('TOTAL', 'Всего'),
            totalPart: sum.total,
            broken: parseFloat((sum.broken / sum.total * 100).toFixed(2)) + '%',
        };

        const replaceTexts = (data) => {
            hoverTextOptions.forEach((option, i) => {
                const textNode = instance.texts[i];

                if (typeof textNode !== undefined) {
                    textNode.attr({
                        text: option.getter(data),
                    });
                }
            });
        };

        const instance = this;

        return {
            chart: {
                type: 'pie',
                events: {
                    load: function() {
                        const { renderer, chartWidth, chartHeight } = this;

                        const cx = chartWidth / 2;
                        const cy = chartHeight / 2;

                        instance.texts = hoverTextOptions.map(options => renderer.text(
                            options.getter(totalData),
                            cx,
                            cy + options.offset,
                        ).attr({
                            fill: options.fill,
                            'font-size': options.size,
                            align: 'center',
                        }).add());
                    },
                },
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_AMOUNT_TITLE', 'Количество STB ИТВ МРФ Волга'),
            },
            plotOptions: {
                pie: Chart.DEFAULT_OPTIONS.plotOptions.pie,
                series: {
                    point: {
                        events: {
                            mouseOver: function() {
                                replaceTexts(this.hoverData);
                            },
                            mouseOut: function() {
                                replaceTexts(totalData);
                            },
                        },
                    },
                },
            },
            series: [{
                name: ls('AMOUNT', 'Количество'),
                colorByPoint: true,
                size: '100%',
                innerSize: '80%',
                data: this.getSeries(),
            }],
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

        const multiply = (data, multiplier) => Object.entries(data).reduce((result, [key, value]) => ({
            ...result,
            [key]: Object.entries(value).reduce((result, [key, value]) => ({
                ...result,
                [key]: typeof value === 'number' ? value * multiplier : value,
            }), {}),
        }), {});

        return rest.get('/api/v1/dashboard/abonents', {}, { queryParams })
            .then(({ data }) => {
                const multipliedData = multiply(data, 100);
                const sum = Object.values(multipliedData).reduce((result, item) => {
                    result.total += item.total;
                    result.broken += item.broken;
                    return result;
                }, {total: 0, broken: 0});

                this.setState({
                    data: multipliedData,
                    sum,
                });
            })
            .catch(console.error);
    }

    getSeries() {
        return Object.entries(this.state.data).reduce((result, [key, { total, broken }], i, ar) => {
            const hoverData = {
                name: key,
                totalPart: parseFloat((total / this.state.sum.total).toFixed(2)) + '%',
                broken: parseFloat((broken / total).toFixed(2)) + '%',
            };

            result.push({
                name: key,
                y: total,
                color: colors[key],
                hoverData,
            });
            result.push({
                name: `${ls('DASHBOARD_CHART_AMOUNT_LABEL_BROKEN', 'Аварийные')} ${key}`,
                y: broken,
                color: {
                    pattern: {
                        path: {
                            d: 'M2,-2l16,16M-2,2l16,16M-2,10l8,8M10,-2l8,8z',
                            strokeWidth: 1.5,
                            stroke: colors[key],
                        },
                        width: 16,
                        height: 16,
                    },
                },
                legendIndex: i + ar.length,
                hoverData,
            });
            return result;
        }, []);
    }

    render() {
        return (
            <Chart
                ref={chart => this.chart = chart}
                options={this.getChartOptions()}
            />
        );
    }
}

export default Amount;
