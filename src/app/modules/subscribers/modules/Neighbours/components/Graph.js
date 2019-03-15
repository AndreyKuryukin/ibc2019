import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Highcharts from 'highcharts';
import moment from 'moment';
import { convertUTC0ToLocal } from '../../../../../util/date';
import Preloader from '../../../../../components/Preloader';
import { createKRenderer } from '../../../helpers';

const neighbourShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        common: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        date_time: PropTypes.string.isRequired,
    })).isRequired,
});

const graphContainerStyle = { width: '95%', margin: '0 auto' };
const KABRenderer = createKRenderer(95);

class NeighboursGraph extends React.PureComponent {
    static propTypes = {
        data: PropTypes.oneOfType([
            PropTypes.arrayOf(neighbourShape),
            neighbourShape,
        ]).isRequired,
        style: PropTypes.object,
        isLegendDisplayed: PropTypes.bool,
        isLoading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        style: null,
        isLegendDisplayed: true,
    };

    componentDidMount() {
        if (this.props.data) {
            this.initChart(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.data !== this.props.data)) {
            this.initChart(nextProps);
        }
    }

    initChart = (props = this.props) => {
        const data = props.isLoading ? [] : props.data;
        const series = _.isArray(data) ? this.getSeries(data) : [this.prepareDataNode(data)];

        const options = {
            credits: { enabled: false },
            chart: {
                type: 'spline',
            },
            title: {
                text: '<span style="color: #0f5276;">Динамика К<sub>аб</sub></span>',
                align: 'left',
                useHTML: true,
                x: 10,
            },
            legend: {
                enabled: !!props.isLegendDisplayed,
                verticalAlign: 'top',
                floating: true,
                x: 80,
                labelFormatter: this.legendLabelFormatter,
                useHTML: true,
                reversed: true,
            },
            tooltip: {
                backgroundColor: '#082545',
                padding: 0,
                borderRadius: 7,
                borderWidth: 0,
                style: { color: 'white' },
                useHTML: true,
                shared: true,
                formatter: function(tooltip) {
                    const dataPointsNames = this.points.map(p => p.series.name);
                    const points = tooltip.chart.series
                        .filter(s => !dataPointsNames.includes(s.name))
                        .map(s => ({
                            name: s.name,
                            color: s.color,
                            y: s.processedYData[s.processedYData.length - 1],
                        }))
                        .concat(this.points);

                    return `
                        <div style="display: block; background: #082545; padding: 8px; border-radius: 7px;">
                            <span style="font-size: 11px">${moment(this.x).format('DD.MM.YYYY HH:mm:ss')}</span><br>
                            ${points.reduce((str, point) => {
                                let kabColor;
                                if (point.y > 95) {
                                    kabColor = 'green';
                                } else if (point.y < 95) {
                                    kabColor = 'red';
                                }
                                return (str + `<span style="color:${point.color}">\u25CF</span>${point.name || point.series.name}: 
                                <b style="color:${kabColor || ''}">${_.isNumber(point.y) ? point.y.toFixed(2) : point.y}%</b><br/>`);
                            }, '')}   
                        </div>
                    `;
                },
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
                    rotation: -45,
                    formatter: this.xLabelFormatter
                },
            },
            yAxis: {
                title: { text: null },
                gridLineWidth: 0,
                lineWidth: 1,
                lineColor: 'rgba(0, 0, 0, 0.2)',
                labelColor: 'rgba(0, 0, 0, 0.5)',
            },
            series,
            exporting: { enabled: false },
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options,
        );
    };

    legendLabelFormatter() {
        return this.options.main ? `<i style="padding-right: 5px;">${this.name}</i>` : this.name;
    };

    xLabelFormatter() {
        return moment(this.value).format('DD.MM.YYYY HH:mm');
    };

    prepareDataNode = node => ({
        id: node.id,
        name: node.id,
        main: node.main,
        lineWidth: node.main ? 5 : 2,
        visible: node.main,
        data: node.value
            .map(value => [convertUTC0ToLocal(value.date_time).valueOf(), _.isNumber(value.common) ? parseFloat(value.common.toFixed(2)) : 0])
            .sort((point1, point2) => point1[0] - point2[0]),
    });

    getSeries = data => data.map(this.prepareDataNode).sort((node1, node2) => {
        if (node1.main && node2.main) return -1;

        return node1.main ? 1 : -1;
    });

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 10,
                    background: '#fff',
                    ...this.props.style,
                }}
            >
                <Preloader active={this.props.isLoading}>
                    <div
                        style={graphContainerStyle}
                        ref={container => this.container = container}
                    />
                </Preloader>
            </div>
        );
    }
}

export default NeighboursGraph;
